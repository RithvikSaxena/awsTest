import express from 'express';
import db from '../../config/mysql.js'; // Import db for querying MySQL
import { verifyToken } from '../middleware/auth.js';
import { validateNonceAndTimestamp } from '../middleware/auth.js';
import CryptoJS from 'crypto-js';

const router = express.Router();
const SECRET_KEY = 'Abc123@#$Secret-Key1';
router.use(express.json());

function decryptEmail(encryptedEmail) {
    const bytes = CryptoJS.AES.decrypt(encryptedEmail, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
}

// Route to create a new note
router.post('/create', async (req, res) => {
    const { email, title, content } = req.body;
    const originalEmail = decryptEmail(email);
    try {
        // Insert into notes table
        const result = await db.query('INSERT INTO notes (email, title, content) VALUES (?, ?, ?)', [originalEmail, title, content]);
        res.status(200).json({ message: 'Note created successfully', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Route to fetch notes for a specific user
router.post('/fetch',verifyToken, async (req, res) => {
    const { email } = req.body;
    //const  email  = req.email;

    const originalEmail = decryptEmail(email);

    console.log('Fetching notes for email:', originalEmail);

    try {
        //const results = await db.query('SELECT * FROM notes WHERE email = ?', [email]);
        const results = await db.query('SELECT * FROM notes WHERE email = ?', [originalEmail]);
        res.status(200).json(results); // Send the results of the query
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});




// Route to delete a specific note for a user

router.post('/delete', validateNonceAndTimestamp, async (req, res) => {
    const { email, title } = req.body;
    const originalEmail = decryptEmail(email);

    try {
        const result = await db.query('DELETE FROM notes WHERE email = ? AND title = ?', [originalEmail, title]);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: 'Note deleted successfully' });
        } else {
            res.status(404).json({ error: 'Note not found' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
