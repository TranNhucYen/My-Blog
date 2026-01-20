"use strict";
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Post extends Model {
        static associate(models) {
            Post.belongsTo(models.User, { 
                foreignKey: 'userId',
                onDelete: 'SET NULL'
            });
        }
    }

    Post.init({
        id : {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING(255),
            allowNull: false
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        thumbnailPath: {
            type: DataTypes.STRING(255),
            allowNull: true,
            field: 'thumbnail_path'
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: 'user_id'
        }
    }, {
        sequelize,
        modelName: 'Post',
        tableName: 'posts',
        underscored: true,
        timestamps: true
    });


    return Post;
};
