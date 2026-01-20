const path = require('path');
const { Post } = require(path.join(__dirname, '..', 'models'));

module.exports = async (req, res, next) => {
    try {
        const postId = req.params.id;
        const userId = req.session.user.id;
        const userRole = req.session.user.role;

        if (userRole === 'superadmin') {
            return next();
        }

        const post = await Post.findOne({
            where: { 
                id: postId, 
                user_id: userId 
            }
        });

        if (!post) {
            return res.status(403).json({ 
                error: 'You do not have permission to modify this post' 
            });
        }

        next();
    } catch (error) {
        console.error('Ownership check error:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
