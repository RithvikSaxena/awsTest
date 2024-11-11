import jwt from 'jsonwebtoken';

const SECRET_KEY = 'Abc123@#$Secret-Key1'; // Replace with an environment variable

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ error: 'Token is required' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.email = decoded.email;
        next();
    });
};
