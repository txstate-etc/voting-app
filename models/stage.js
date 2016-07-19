"use strict";

module.exports = function(sequelize, DataTypes) {
  var Stage = sequelize.define("stage", {
    name: DataTypes.TEXT('tiny')
  }, {
    classMethods: {
       associate: function(models) {
         Stage.hasMany(models.idea);
       }
    }
  });

  return Stage;
};