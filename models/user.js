"use strict";
//Do we really need the first and last names?
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define("user", {
    firstname: DataTypes.STRING(),
    lastname: DataTypes.STRING(),
    netid: DataTypes.STRING(),
    affiliation: DataTypes.ENUM('student', 'faculty', 'staff', 'moderator'),
    admin: {type: DataTypes.BOOLEAN(), defaultValue: false},
    commentMod: {type: DataTypes.BOOLEAN(), defaultValue: false},
    ideaMod: {type: DataTypes.BOOLEAN(), defaultValue: false},
    deleted: {type: DataTypes.BOOLEAN(), defaultValue: false}
  }, {
    classMethods: {
       associate: function(models) {
         User.hasMany(models.idea, {foreignKey: 'creator'});
         User.hasMany(models.file, {foreignKey: 'creator'});
         User.hasMany(models.vote);
         User.hasMany(models.comment);
       },
       findByNetId: function(id){
          return this.find({where: {netid: id}})
       }
    }
  });

  return User;
};