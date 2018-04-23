
'use strict';
module.exports = function (sequelize, DataTypes) {
  var Online = sequelize.define("Online", {
    name: {
      type: DataTypes.STRING
    },
    projectId: {
      type: DataTypes.INTEGER
    }, 
    projectName: {
      type: DataTypes.TEXT
    }, 
    description: {
      type: DataTypes.TEXT
    },
    version: {
      type: DataTypes.STRING
    },
    url: {
      type: DataTypes.STRING
    },
    type: {
      type: DataTypes.STRING
    },
   
    status: {
      type: DataTypes.STRING,
      // defaultValue: 'normal'
    },
  });
  return Online;
};