const { DataTypes } = require("sequelize");

module.exports = (sequelize, Sequelize) => {
    const User = sequelize.define("user", {
   
        user_id: {

            type: DataTypes.STRING,
            required: true,
            allowNull: false,
            primaryKey: true,
       
        }


    });
 
    return User;
  };