'use strict';
module.exports = function (sequelize, DataTypes) {
  var Role = sequelize.define("Role", {
    name: {
      //权限名称
      type: DataTypes.STRING
    },
    userId: {
      type: DataTypes.INTEGER
    },
    roleName: {
      //权限对应的角色名
      type: DataTypes.STRING
    }
  }, {
    classMethods: {
      associate: function(models) {
        Role.belongsTo(models.User);
      }
    }
  },{freezeTableName: true,timestamps: false});
  return Role;
};