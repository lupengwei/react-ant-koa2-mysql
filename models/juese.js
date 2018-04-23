'use strict';
module.exports = (sequelize, DataTypes) => {
  var juese = sequelize.define('juese', {
    text: DataTypes.STRING
  }, {});
  juese.associate = function(models) {
    // associations can be defined here
  };
  return juese;
};