import mysql from 'mysql';
import AWS from 'aws-sdk';
import { promisify } from 'util';

// Set the region and create an instance of the Secrets Manager service
AWS.config.update({ region: 'ap-south-1' }); // e.g., 'us-west-2'
const secretName = 'React_DB_Credentials'; // Replace with your secret name

const client = new AWS.SecretsManager();
let dbCredentials;

// Retrieve the secret
const getSecret = async () => {
    try {
        const data = await client.getSecretValue({ SecretId: secretName }).promise();
        console.log('Raw secret string:', data.SecretString); // Log the raw string

        if ('SecretString' in data) {
            try {
                dbCredentials = JSON.parse(data.SecretString); // Parse the JSON string
                console.log('Parsed credentials:', dbCredentials);
            } catch (parseError) {
                console.error('Error parsing JSON:', parseError);
                return; // Handle error
            }
        }
    } catch (err) {
        console.error('Error retrieving secret:', err);
    }
};

// Create the MySQL connection using the retrieved credentials
const connectToDatabase = async () => {
    await getSecret(); // Ensure we have the credentials before proceeding

    if (!dbCredentials) {
        console.error('No database credentials found!');
        return;
    }

    try {
        // Create the MySQL connection using the retrieved credentials
        const connection = mysql.createConnection({
            host: dbCredentials.host,
            port: dbCredentials.port,
            user: dbCredentials.user, // Adjust based on your secret structure
            password: dbCredentials.password,
            database: dbCredentials.database, // Adjust based on your secret structure
            connectTimeout: 60000,
        });

        // Promisify query for async/await compatibility
        connection.query = promisify(connection.query);

        console.log('Connected to the database!');

        // Return the connection instance for reuse
        return connection;

    } catch (err) {
        console.error('Error connecting to the database:', err);
    }
};

// Exporting the db object that has the query function
const db = {
    query: async (sql, params) => {
        const connection = await connectToDatabase();
        if (!connection) {
            throw new Error('Database connection failed');
        }
        try {
            const results = await connection.query(sql, params);
            return results;  // Returning only the results
        } catch (err) {
            console.error('Error executing query:', err);
            throw err; // Re-throw the error for the calling code to handle
        } finally {
            connection.end(); // Close the connection after the query
        }
    },
};

export default db;
