import express from 'express';
import db from '../../config/mysql.js';
import jwt from 'jsonwebtoken';

const router = express.Router();
router.use(express.json());
const SECRET_KEY = 'Abc123@#$Secret-Key1'; // Replace with an environment variable

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000; // Lock account for 5 minutes

router.post('/login', async (req, res) => {
    console.log(req.body);
    debugger;
    const { email, password } = req.body;

    // UNCOMMENT THE BELOW CODE FOR SQLi: query without parameterization
    const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;
    try {
        // Await query response and destructure to get the result
        const [result] = await db.query(query);  // Ensure db.query returns an array

        if (result != undefined) {

            const currentTime = new Date();
            if (result.lockout_time && new Date(result.lockout_time) > currentTime) {
                const remainingLockTime = Math.ceil((new Date(result.lockout_time) - currentTime) / 1000);
                return res.status(403).json({
                    error: `Account locked. Please try again in ${remainingLockTime} seconds.`
                });
            }
            else {
                // Reset failed attempts and lockout time on successful logins
                await db.query('UPDATE users SET failed_attempts = 0, lockout_time = NULL WHERE email = ?', [email]);
                // Generate JWT token
                const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '1h' });
                res.cookie('token', token, {
                    httpOnly: true,  // Cookie can't be accessed via JavaScript (security measure)
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'Strict',
                    maxAge: 3600000,
                });
                res.status(200).json({ token, user: result });
            }

        } else {
           
            const query1 = `SELECT * FROM users WHERE email = '${email}'`;
            const [result1] = await db.query(query1);
            
            if (result1 != undefined) {
                if (password !== result1.password) {
                    // Increment failed login attempts
                    const  query1 = `UPDATE users SET failed_attempts = failed_attempts + 1 WHERE email = '${email}'`;
                    await db.query(query1);

                    // Lock account if failed attempts exceed MAX_FAILED_ATTEMPTS
                    const currentTime = new Date();
                    if (result1.failed_attempts >= MAX_FAILED_ATTEMPTS - 1) {
                        const lockoutTime = new Date(currentTime.getTime() + LOCK_TIME);
                        const lockoutTimeString = lockoutTime.toISOString().slice(0, 19).replace('T', ' '); // MySQL-compatible format

                        const  query1 = `UPDATE users SET lockout_time = '${lockoutTimeString}' WHERE email = '${email}'`;
                        await db.query(query1);
                        return res.status(403).json({ error: 'Account locked due to too many failed attempts. Please try again later.' });
                    }
    
                }
            }
            else{
                res.status(401).json({
                    error: 'Invalid credentials. Wrong password or username'
                });
            }
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
        if (existingUser != undefined) {
            console.log("User already exists");
        } else {
            // Insert user into database
            await db.query('INSERT INTO users (email, password, failed_attempts, lockout_time) VALUES (?, ?, 0, NULL)', [email, password]);
            res.send("Values inserted");
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: err });
    }
});

export default router;
