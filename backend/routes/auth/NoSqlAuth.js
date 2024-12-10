import express from 'express';
import { MongoClient } from 'mongodb';
import Joi from 'joi';

const router = express.Router();
router.use(express.json());

const mongoURI = 'mongodb://localhost:27017'; // Replace with your connection string
const dbName = 'Users';
let db;

// Connect to MongoDB
MongoClient.connect(mongoURI, { useUnifiedTopology: true })
    .then((client) => {
        db = client.db(dbName);
        console.log('Connected to MongoDB');
    })
    .catch((err) => console.error('Failed to connect to MongoDB:', err));

    // Define validation schema
const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
});

// Vulnerable Login Endpoint
router.post('/NoSqllogin', async (req, res) => {
    const { email, password } = req.body;
 // Validate input (uncomment for safe)
//  const { error } = loginSchema.validate({ email, password });
//  if (error) {
//      return res.status(400).json({ error: 'Invalid input' });
//  }
    try {
        // Vulnerable query: directly using user inputs
        const user = await db.collection('Users').findOne({ email: email, password: password });

        if (user) {
            res.status(200).json({ message: 'Login successful' });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (err) {
        console.error('Error querying MongoDB:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
