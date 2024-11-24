const jwt = require('jsonwebtoken');
const jwtAuthMiddleware = (req, res, next) => {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
}

//function to generate jwt token
const generateToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET);
}

module.exports = {jwtAuthMiddleware, generateToken};