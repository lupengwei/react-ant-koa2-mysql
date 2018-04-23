'use strict';
module.exports = function (sequelize, DataTypes) {
const  Feedback = sequelize.define("Feedback", {
    content: {
      type: DataTypes.TEXT
    },
    modal: {
      type: DataTypes.TEXT
    },
    status: {
      type: DataTypes.TEXT
    },
    accept: {
      type: DataTypes.TEXT
    },
    date: {
      type: DataTypes.DATE
    },
    userId: {
      type: DataTypes.INTEGER
    },
    reply: {
      type: DataTypes.TEXT
    },
    projectId: {
      type: DataTypes.INTEGER
    }, 
    projectName: {
      type: DataTypes.TEXT
    },
   
} ,{freezeTableName: true});
  Feedback.associate = function(models){
    Feedback.belongsTo(models.User);
  }
  return Feedback;
};
