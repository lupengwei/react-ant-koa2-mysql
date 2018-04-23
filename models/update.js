'use strict';
module.exports = function (sequelize, DataTypes) {
  var Update = sequelize.define("Update", {
    content: {
      type: DataTypes.TEXT
    },
    date: {
      type: DataTypes.DATE
    },
    version: {
      type: DataTypes.TEXT
    },
    people: {
      type: DataTypes.TEXT
    },
    projectId: {
      type: DataTypes.INTEGER
    }, 
    projectName: {
      type: DataTypes.TEXT
    },  
  },{freezeTableName: true,timestamps: false});
  // Update.associate = function (models){
  //   Update.belongsTo(models.User);
  // }
  return Update;
};