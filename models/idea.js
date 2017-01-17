"use strict";

module.exports = function(sequelize, DataTypes) {
  var Idea = sequelize.define("idea", {
    title: DataTypes.STRING(),
    text: DataTypes.TEXT(),
    views: DataTypes.INTEGER()
  }, {
    indexes: [
      { type: 'FULLTEXT', fields: ['title'] },
      { type: 'FULLTEXT', fields: ['text']}
    ],
    classMethods: {
      associate: function(models) {
        Idea.belongsToMany(models.category,{ through: models.categories_ideas});
        Idea.belongsTo(models.user, {foreignKey: 'creator'});
        Idea.belongsTo(models.stage, {constraints: false});
        Idea.hasMany(models.vote);
        Idea.hasMany(models.comment);
        Idea.hasMany(models.file, {foreignKey: 'owner_id', constraints: false, scope: {owner_type: 'idea'}});
      }
    }
  });

  return Idea;
};