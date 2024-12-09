import jwt from 'jsonwebtoken';


const SECRET_KEY = 'Abc123@#$Secret-Key1'; // Replace with an environment variable

//uncomment for local storage
export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(403).json({ error: 'Token is required' });

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).json({ error: 'Unauthorized' });
        req.email = decoded.email;
        next();
    });
};


// export const verifyToken = (req, res, next) => {
//     if(req.headers.cookies.token != undefined){
//     const token = req.cookies.token; // Retrieve token from cookies
//     if (!token) return res.status(403).json({ error: 'Token is required' });

//     jwt.verify(token, SECRET_KEY, (err, decoded) => {
//         if (err) return res.status(401).json({ error: 'Unauthorized' });
//         req.email = decoded.email;
//         next();
//     });
// }
// };

export const usedNonces = new Set();
export const  validateNonceAndTimestamp = (req, res, next) => {
    const { 'x-nonce': nonce, 'x-timestamp': timestamp } = req.headers;

    // Check if nonce is present
    if (!nonce) {
        return res.status(400).json({ error: 'Nonce is missing' });
    }

    // Check if nonce has already been used
    if (usedNonces.has(nonce)) {
        return res.status(400).json({ error: 'Replay attack detected: Nonce already used' });
    }

    // Add nonce to the used set
    usedNonces.add(nonce);

    // Check if timestamp is within a valid range (e.g., 5 minutes)
    const currentTimestamp = Date.now();
    if (Math.abs(currentTimestamp - timestamp) > 5 * 60 * 1000) { // 5 minutes
        return res.status(400).json({ error: 'Request timestamp is too old' });
    }

    // Proceed to the next middleware or route handler
    next();
};
