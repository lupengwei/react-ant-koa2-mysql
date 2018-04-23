'use strict';
var moment = require('moment');
var _ = require('lodash');
module.exports = function (sequelize, DataTypes) {
  var User = sequelize.define("User", {
    userid: {
      type: DataTypes.STRING
    },
    dingId: {
      type: DataTypes.STRING
    },
    name: {
      type: DataTypes.STRING
    },
    active: {
      type: DataTypes.BOOLEAN
    },
    position: {
      type: DataTypes.STRING
    },
    email: {
      type: DataTypes.STRING
    },
    avatar: {
      type: DataTypes.STRING
    },
    jobnumber: {
      type: DataTypes.STRING
    },
    admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    company: {
      type: DataTypes.STRING
    },
    department: {
      type: DataTypes.STRING
    },
    suoxie: {
      type: DataTypes.STRING
    },
    pinyin: {
      type: DataTypes.STRING
    },
    privateSign: {
      type: DataTypes.STRING
    },
    canCreateProject: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    wxid: {
      type: DataTypes.STRING
    },
    administrator: {
      type: DataTypes.BOOLEAN
    },
    dimission: {
      //正常（默认），待离职，已离职
      type: DataTypes.STRING
    }

  },{freezeTableName: true,timestamps: false});
  User.associate = function (models){
    User.hasMany(modles.Feedback)
  },
  User.associate = function (models){
    User.belongsToMany(models.Project, {as: 'Projects', through: 'UserProjects', foreignKey: 'userId'});
  },
  User.associate = function (models){
    User.hasMany(models.Role);
  }
  
  return User;
};