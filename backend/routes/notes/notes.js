import express from 'express';
import db from '../../config/mysql.js'; // Import db for querying MySQL

const router = express.Router();
router.use(express.json());

// Route to create a new note
router.post('/create', async (req, res) => {
    const { email, title, content } = req.body;

    try {
        // Insert into notes table
        const result = await db.query('INSERT INTO notes (email, title, content) VALUES (?, ?, ?)', [email, title, content]);
        res.status(200).json({ message: 'Note created successfully', result });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Route to fetch notes for a specific user
router.post('/fetch', async (req, res) => {
    const { email } = req.body;
    console.log('Fetching notes for email:', email);

    try {
        const results = await db.query('SELECT * FROM notes WHERE email = ?', [email]);
        res.status(200).json(results); // Send the results of the query
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Route to delete a specific note for a user
router.post('/delete', async (req, res) => {
    const { email, title } = req.body;

    try {
        const result = await db.query('DELETE FROM notes WHERE email = ? AND title = ?', [email, title]);
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
