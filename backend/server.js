import express from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import userauth from './routes/auth/userauth.js';
import notes from './routes/notes/notes.js'; 
import documents from './routes/documents/documents.js';
import NoSqlAuth from './routes/auth/NoSqlAuth.js';
import AWS from 'aws-sdk';
import cookieParser from 'cookie-parser';
import rateLimit from 'express-rate-limit';
//import helmet from 'helmet';

const app = express();

// app.use(
//     helmet.contentSecurityPolicy({
//       directives: {
//         defaultSrc: ["'self'"],
//         scriptSrc: ["'self'"],
//         objectSrc: ["'none'"],
//         imgSrc: ["'self'", "data:"], // Allow self-hosted and data URIs for images
//         frameAncestors: ["'none'"],  // Prevents your site from being framed anywhere
//         styleSrc: ["'self'"], // Allow inline styles (optional)
//       },
//     })
//   );
  

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 5000, // limit each IP to given requests per windowMs
    message: 'Too many requests, please try again later.',
  });

app.use(cors())
app.use('/auth', userauth);
app.use('/notes', notes);
app.use(express.json()); 
app.use('/documents', documents);
app.use('/NoSQLauth', NoSqlAuth);
app.use(cookieParser());
app.use(limiter);

AWS.config.update({ region: 'ap-south-1' });
const secretsManager = new AWS.SecretsManager();

// Serve static files from the "files" directory
//const staticPath = 'C:/Users/Administrator/Desktop/awsTest/backend';
const staticPath = 'C:/nginx-1.27.0/html';

// Use the current directory as the static path
//const staticPath = __dirname;

app.use(express.static(staticPath));

// Route to update the file content
app.put('/update-file', (req, res) => {
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).json({ error: 'Filename and content are required' });
    }

    const filePath = path.join(staticPath, filename);

    // Write new content to the file
    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ error: 'Failed to write to file' });
        }
        res.json({ message: 'File updated successfully' });
    });
});
const getSecret = async (secretName) => {
    try {
        const data = await secretsManager.getSecretValue({ SecretId: secretName }).promise();
        return JSON.parse(data.SecretString);
    } catch (err) {
        console.error("Error retrieving secret:", err);
        throw err;
    }
};
app.get('/api/base-url', async (req, res) => {
    try {
        const secret = await getSecret('ReactApiBaseUrl');
        const ResUrl = JSON.parse(secret.ReactApiBaseUrl).baseUrl;
        res.json({ baseUrl: ResUrl });
    } catch (err) {
        res.status(500).send("Error retrieving base URL");
    }
});

  app.get('/api/rateLimitapi', (req, res) => {
    res.send('This is a rate-limited API endpoint');
  });

app.get(('/'), (req, res)=>{
    res.send("API is running and avaliable")
})


app.listen(5000, () => {
    console.log('Server is running on port ${5000}');
});

