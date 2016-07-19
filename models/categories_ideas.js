"use strict";

module.exports = function(sequelize, DataTypes) {
  var Category = sequelize.define("categories_ideas", {}, {
    timestamps: false
  });

  return Category;
};