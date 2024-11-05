import express from 'express';
import db from '../../config/mysql.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.use(express.json());
const SECRET_KEY = 'Abc123@#$Secret-Key1'; // Replace with an environment variable

router.post('/login', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    // UNCOMMENT THE BELOW CODE FOR SQLi : query without parameterization 
    const query = `SELECT * FROM users WHERE email = ${email} AND password = ${password}`;
    db.query(query, (err, result) => {
        if (err) {
            console.log(err);
            res.status(500).json({
                error: err
            });
        } else {
            if (result.length > 0) {
                // Generate JWT token
                const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
                res.status(200).json({ token, user: result });
            } else {
                res.status(401).json({
                    error: 'Invalid credentials. Wrong password or username'
                });
            }
        }
    });

    // Code without SQLi - comment this during SQLi
    // db.query('SELECT * FROM users WHERE email = ? AND password = ?', [email, password], (err, result) => {
        // if (err) {
            // console.log(err);
            // res.status(500).json({ error: err });
        // } else {
            // if (result.length > 0) {
                // Generate JWT token
                // const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
                // res.status(200).json({ token, user: result });
            // } else {
                // res.status(401).json({ error: 'Invalid credentials. Wrong password or username' });
            // }
        // }
    // })
});

router.post('/signup', (req, res) => {
    const { email, password } = req.body;
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                console.log("User already exists");
            } else {
                // insert user into database
                db.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, password], (err, result) => {
                    if (err) {
                        console.log(err);
                    } else {
                        res.send("Values inserted");
                    }
                });
            }
        }
    });
});

export default router;
