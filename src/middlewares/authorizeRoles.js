// Middleware to check roles before accessing cetain routes

const authorizeRoles = (roles) => {
    return (req, res, next) => {
        const userRole = req.cookies.role;

        // If no role is found in the cookies, deny access
        if (!userRole) {
            return res.status(403).json({ error: 'Insufficient permissions. Role not found in cookies.' });
        }
        
        if(!roles.includes(userRole)) 
        {
            return res.status(403).json({ error: 'Insufficient permissions.' });
        }

        next();
    };
};

module.exports = authorizeRoles;
