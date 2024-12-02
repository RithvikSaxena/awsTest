import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { verifyToken } from '../middleware/auth.js';

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Directory path for documents
const directoryPath = 'C:/nginx-1.27.0/html';
//const directoryPath = 'C:/Users/Administrator/Downloads/nginx-1.26.2/nginx-1.26.2/html';
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

export default router;
