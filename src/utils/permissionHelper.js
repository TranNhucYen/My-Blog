exports.canModifyPost = (postUserId, currentUser) => {

    if (!currentUser) return false;

    return currentUser.role === 'superadmin' || postUserId === currentUser.id;
};


exports.isSuperAdmin = (user) => {
    return user && user.role === 'superadmin';
};