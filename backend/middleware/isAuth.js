import jwt from 'jsonwebtoken';

const isAuth = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            // Use 401 for unauthorized access
            return res.status(401).json({ message: "No token provided, authorization denied." });
        }

        // Verify the token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Attach user ID to the request for the next middleware
        req.userId = decoded.userId;
        next();

    } catch (error) {
        // Catch errors from jwt.verify (e.g., expired or invalid token)
        console.error("Authentication Error:", error.message);
        return res.status(401).json({ message: "Token is not valid." });
    }
};

export default isAuth;