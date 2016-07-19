"use strict";

module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("category", {
    name: DataTypes.TEXT('tiny')
  }, {
    classMethods: {
       associate: function(models) {
         Category.belongsToMany(models.idea,{ through: models.categories_ideas});
       }
    }
  });

  return Category;
};