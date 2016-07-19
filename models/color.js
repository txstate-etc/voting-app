"use strict";

//Ideas don't actually have colors.  I'm just using this to try fixtures for testing
module.exports = function(sequelize, DataTypes) {
  var Color = sequelize.define("color", {
    name: DataTypes.TEXT('tiny'),
    red: DataTypes.INTEGER(),
    green: DataTypes.INTEGER(),
    blue: DataTypes.INTEGER()
  }, {
    classMethods: {
       associate: function(models) {
         //Color.hasMany(models.idea)
       }
    }
  });

  return Color;
};