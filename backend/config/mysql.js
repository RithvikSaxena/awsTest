import mysql from 'mysql';

const connection = mysql.createConnection({
  host: 'database-1.cvi0ioys6exv.ap-southeast-2.rds.amazonaws.com',
  port: 3306,
  user: 'admin',
  password: 'password',
  database: 'mydb'
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database as id ' + connection.threadId);
});

const createTableQueries = [
    `CREATE TABLE IF NOT EXISTS users (
      email VARCHAR(255) NOT NULL PRIMARY KEY,
      password VARCHAR(255) NOT NULL
    )`,
    `CREATE TABLE IF NOT EXISTS notes (
      email VARCHAR(255) NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT NOT NULL,
      PRIMARY KEY (email, title)
    )`
  ];

  createTableQueries.forEach(query => {
    connection.query(query, (err, results) => {
      if (err) {
        console.error('Error creating table:', err.stack);
        return;
      }
      console.log('Table created or already exists.');
    });
  });

  
export default connection;