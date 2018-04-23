
'use strict';
module.exports = function (sequelize, DataTypes) {
  var OnlineType = sequelize.define("OnlineType", {
    name: {
      type: DataTypes.TEXT,
      unique: true,
    },
    projectId: {
      type: DataTypes.INTEGER
    }, 
    projectName: {
      type: DataTypes.TEXT
    },  
  },{freezeTableName: true,timestamps: false});
  return OnlineType;
};