const authorize = (...input) => {
    const roles = Array.isArray(input[0]) ? input[0] : input;

    return (req, res, next) => {
        if (!req.session.user || !roles.includes(req.session.user.role)) {
            return res.status(403).json({ error: 'Permission denied' });
        }
        next();
    };
};

module.exports = authorize;
