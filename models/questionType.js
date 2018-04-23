
'use strict';
module.exports = function (sequelize, DataTypes) {
  var QuestionType = sequelize.define("QuestionType", {
    name: {
      type: DataTypes.TEXT,
      unique: true  
    },
    projectId: {
      type: DataTypes.INTEGER
    }, 
    projectName: {
      type: DataTypes.TEXT
    },  

  },{freezeTableName: true,timestamps: false});
  QuestionType.associate = function (models){
    QuestionType.belongsTo(models.User);
  }
  return QuestionType;
};