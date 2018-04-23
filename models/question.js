'use strict';
module.exports = function (sequelize, DataTypes) {
  var Question = sequelize.define("Question", {
    title: {
      type: DataTypes.TEXT
    },
   type: {
      type: DataTypes.TEXT
    },
    flag: {
      type: DataTypes.TEXT
    },
    content: {
      type: DataTypes.TEXT
    }, 
    projectId: {
      type: DataTypes.INTEGER
    }, 
    projectName: {
      type: DataTypes.TEXT
    }, 

  },
  {freezeTableName: true,timestamps: false}
);
  
  Question.associate = function (models){
    Question.belongsTo(models.User);
  }
  return Question;
};