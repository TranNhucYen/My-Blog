const ApiError = require('../utils/apiError');
const { Sequelize } = require('sequelize');
const { User, Post } = require('../models');

const verifyUserCredentials = async (email, password) => {
    const user = await User.findOne({
        where: { email }
    });
    if (!user) return null;
    if (!(await user.checkPassword(password))) return null;
    return user;
}



const readAllUsers = async () => {
    const users = await User.findAll({
        attributes: ['id', 'username', 'email', 'role'],
        order: [['createdAt', 'DESC']],
        raw: true,

        
    });
    return users;
}

const createUser = async (userData) => {
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
        throw new ApiError(409, 'Email already exists');
    }
    const user = await User.create(userData);
    return user;
}

const updateUser = async (userId, newData) => {
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'User not found');
    // Handle unique constraint error for email
    try {
        // if email is being updated
        return await user.update(newData);
    } catch (error) {
        if (error instanceof Sequelize.UniqueConstraintError) throw new ApiError(409, 'Email already exists');
    }
}

const deleteUser = async (userId) => {
    const user = await User.findByPk(userId);
    if (!user) throw new ApiError(404, 'User not found');
    await user.destroy();
    return user;
}

// admin statistics service 
const getStatistics = async () => {
    const totalAdmin = await User.count({ where: { role: 'admin' }, raw: true });
    return {
        totalAdmin,
    }
}

module.exports = {
    verifyUserCredentials,
    readAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getStatistics
};

