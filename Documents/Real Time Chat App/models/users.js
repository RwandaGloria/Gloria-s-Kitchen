const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
   
        user_id: {

            type: DataTypes.BIGINT.UNSIGNED,
            required: true,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        sessionID: {

            type: DataTypes.STRING,
            required: true,
            allowNull: true
        },
        messages :{
            type: DataTypes.JSON,
            required: false
        },
        isActive:{
            type: DataTypes.BOOLEAN,
            required: false, 
            allowNull: false

        }


    });
 
    return User;
  };