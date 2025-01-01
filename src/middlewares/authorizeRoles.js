// Middleware to check roles before accessing cetain routes

const authorizeRoles = (roles) => {
    return (req, res, next) => {
        const userRole = req.user.role;
        
        if(!roles.includes(userRole)) 
        {
            return res.status(403).json({ error: 'Insufficient permissions.' });
        }

        next();
    };
};

module.exports = authorizeRoles;
