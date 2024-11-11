import express from 'express';
import db from '../../config/mysql.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.use(express.json());
const SECRET_KEY = 'Abc123@#$Secret-Key1'; // Replace with an environment variable

router.post('/login', async (req, res) => {
    console.log(req.body);
    debugger;
    const { email, password } = req.body;

    // UNCOMMENT THE BELOW CODE FOR SQLi: query without parameterization
    const query = `SELECT * FROM users WHERE email = ${email} AND password = ${password}`;
    try {
        // Await query response and destructure to get the result
        const [result] = await db.query(query);  // Ensure db.query returns an array

        if (result != undefined) {
            // Generate JWT token
            const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
            res.status(200).json({ token, user: result });
        } else {
            res.status(401).json({
                error: 'Invalid credentials. Wrong password or username'
            });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }

    // Code without SQLi - comment this during SQLi
    // try {
    //     const [result] = await db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password]);
    //     if (result.length > 0) {
    //         // Generate JWT token
    //         const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
    //         res.status(200).json({ token, user: result });
    //     } else {
    //         res.status(401).json({ error: 'Invalid credentials. Wrong password or username' });
    //     }
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ error: err });
    // }
});

router.post('/signup', async (req, res) => {
    const { email, password } = req.body;
    try {
        const [existingUser] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        if (existingUser!= undefined) {
            console.log("User already exists");
        } else {
            // Insert user into database
            await db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password]);
            res.send("Values inserted");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

export default router;
