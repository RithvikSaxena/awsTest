import express from 'express';
import db from '../../config/mysql.js'; // Import your MySQL configuration file
import jwt from 'jsonwebtoken';

const router = express.Router();
router.use(express.json());
const SECRET_KEY = 'Abc123@#$Secret-Key1'; // Replace with an environment variable

const MAX_FAILED_ATTEMPTS = 5;
const LOCK_TIME = 5 * 60 * 1000; // Lock account for 5 minutes

router.post('/login', (req, res) => {
    console.log(req.body);
    const { email, password } = req.body;

    // UNCOMMENT THE BELOW CODE FOR SQLi: query without parameterization
    const query = `SELECT * FROM users WHERE email = ${email} AND password = '${password}'`; // Dangerous!

    db.query(query, (err, result) => {
        if (err) {
            console.error('Error executing query:', err);
            return res.status(500).json({ error: err });
        }

        if (result.length > 0) {
            const user = result[0]; // Assuming result contains user details
            const currentTime = new Date();

            if (user.lockout_time && new Date(user.lockout_time) > currentTime) {
                const remainingLockTime = Math.ceil((new Date(user.lockout_time) - currentTime) / 1000);
                return res.status(403).json({
                    error: `Account locked. Please try again in ${remainingLockTime} seconds.`
                });
            } else {
                // Reset failed attempts and lockout time on successful logins
                const resetQuery = "UPDATE users SET failed_attempts = 0, lockout_time = NULL WHERE email = '${email}'";
                db.query(resetQuery, (updateErr) => {
                    if (updateErr) {
                        console.error('Error resetting login attempts:', updateErr);
                        return res.status(500).json({ error: updateErr });
                    }

                    // Generate JWT token
                    const token = jwt.sign({ email }, SECRET_KEY, { expiresIn: '5m' });
                    res.cookie('token', token, {
                        httpOnly: true,
                        secure: process.env.NODE_ENV === 'production',
                        sameSite: 'Strict',
                        maxAge: 3600000, // 1 hour
                    });
                    res.status(200).json({ token, user });
                });
            }
        } else {
            // Check if user exists for failed login
            const query1 = `SELECT * FROM users WHERE email = '${email}'`; // Dangerous!

            db.query(query1, (err1, result1) => {
                if (err1) {
                    console.error('Error checking user existence:', err1);
                    return res.status(500).json({ error: err1 });
                }

                if (result1.length > 0) {
                    const user = result1[0];

                    if (password !== user.password) {
                        // Increment failed login attempts
                        const incrementQuery = `UPDATE users SET failed_attempts = failed_attempts + 1 WHERE email = '${email}'`;
                        db.query(incrementQuery, (incErr) => {
                            if (incErr) {
                                console.error('Error incrementing failed attempts:', incErr);
                                return res.status(500).json({ error: incErr });
                            }

                            // Lock account if failed attempts exceed MAX_FAILED_ATTEMPTS
                            const currentTime = new Date();
                            if (user.failed_attempts >= MAX_FAILED_ATTEMPTS - 1) {
                                const lockoutTime = new Date(currentTime.getTime() + LOCK_TIME);
                                const lockoutTimeString = lockoutTime.toISOString().slice(0, 19).replace('T', ' '); // MySQL-compatible format

                                const lockoutQuery = `UPDATE users SET lockout_time = '${lockoutTimeString}' WHERE email = '${email}'`;
                                db.query(lockoutQuery, (lockErr) => {
                                    if (lockErr) {
                                        console.error('Error locking account:', lockErr);
                                        return res.status(500).json({ error: lockErr });
                                    }
                                    return res.status(403).json({ error: 'Account locked due to too many failed attempts. Please try again later.' });
                                });
                            }else {
                                res.status(401).json({
                                    error: 'Invalid credentials. Wrong password or username'
                                });
                            }
                        });
                    }
                } else {
                    res.status(401).json({
                        error: 'Invalid credentials. Wrong password or username'
                    });
                }
            });
        }
    });
});

router.post('/signup', (req, res) => {
    const { email, password } = req.body;

    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    db.query(checkUserQuery, [email], (checkErr, result) => {
        if (checkErr) {
            console.error('Error checking user existence:', checkErr);
            return res.status(500).json({ error: checkErr });
        }

        if (result.length > 0) {
            console.log("User already exists");
            res.status(400).json({ error: "User already exists" });
        } else {
            const insertUserQuery = 'INSERT INTO users (email, password, failed_attempts, lockout_time) VALUES (?, ?, 0, NULL)';
            db.query(insertUserQuery, [email, password], (insertErr) => {
                if (insertErr) {
                    console.error('Error inserting user:', insertErr);
                    return res.status(500).json({ error: insertErr });
                }
                res.status(201).send("User created successfully");
            });
        }
    });
});

export default router;
