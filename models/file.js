"use strict";
var md5 = require('md5-file');
var fs = require('fs');

//think about some sort of reference counter.

module.exports = function(sequelize, DataTypes) {
  var File = sequelize.define("file", {
    filename: DataTypes.TEXT('tiny'),
    hash: DataTypes.TEXT('tiny'),
    owner_type: DataTypes.ENUM('comment', 'idea', 'reply'),
    owner_id: DataTypes.INTEGER()
  }, {
    classMethods: {
       associate: function(models) {
         File.belongsTo(models.user, {foreignKey: 'creator'});
         File.belongsTo(models.comment, {foreignKey: 'owner_id', as: 'comment', constraints: false});
         File.belongsTo(models.reply, {foreignKey: 'owner_id', as: 'reply', constraints: false});
         File.belongsTo(models.idea, {foreignKey: 'owner_id', as: 'idea', constraints: false});
       },
       saveAttachment: function(id, creator, type, file){
          //TODO: save the file somewhere
          var hash = md5.sync(file.path);
          return File.create({filename: file.originalname, hash: hash, creator: creator, owner_type: type.toLowerCase(), owner_id: id })
       }
    },
    instanceMethods: {
      attachable: function(){
        if(this.owner_type == "comment"){
          return this.comment;
        }
        else if(this.owner_type == "reply"){
          return this.reply;
        }
        else{
          return this.idea;
        }
      }
    }
  });

  return File;
};