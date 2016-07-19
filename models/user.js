"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    firstname: DataTypes.STRING(),
    lastname: DataTypes.STRING(),
    netid: DataTypes.STRING(),
    admin: {type: DataTypes.BOOLEAN(), defaultValue: false},
    commentMod: {type: DataTypes.BOOLEAN(), defaultValue: false},
    ideaMod: {type: DataTypes.BOOLEAN(), defaultValue: false}
  }, {
    classMethods: {
       associate: function(models) {
         User.hasMany(models.idea, {foreignKey: 'creator'});
         User.hasMany(models.file, {foreignKey: 'creator'});
         User.hasMany(models.vote);
         User.hasMany(models.comment);
       }
    }
  });

  return User;
};