'use strict';
module.exports = function (sequelize, DataTypes) {
  var UserLogin = sequelize.define("UserLogin", {
    name: {
      type: DataTypes.STRING
    },
    loginTime: {
      type: DataTypes.DATE
    }

  }, {
    classMethods: {
      associate: function(models) {
      }
    }
  },{freezeTableName: true,timestamps: false});
  return UserLogin;
};