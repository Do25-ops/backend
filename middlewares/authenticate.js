const jwt = require('jsonwebtoken');
const unprotectedRoutes = ['login', 'register', 'check-session','getCompetitionTimings','updateTimings','leaderboardData'];

const isAuthenticated = (req, res, next) => {
    // if (unprotectedRoutes.includes(req.path.split('/')[1])) {
    const lastPathSegment = req.path.split('/').pop(); 
    if (unprotectedRoutes.includes(lastPathSegment)) {
        return next();
    }
    try {   
        const token = req.cookies?.access_token
                
        if (!token) {
            return res.status(401).json({ message: `
                last path : ${lastPathSegment, 'path' , req.path}
                Authentication failed` });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Ensure JWT_SECRET is set in .env        
        req.user = decoded; // Attach user data to the request object
        next(); // User is authenticated
    } catch (err) {
        console.log(err.message)
        return res.status(403).json({ message: 'Forbidden: Invalid token' });
    }
};

module.exports = isAuthenticated;
