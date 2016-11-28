"use strict";

module.exports = function(sequelize, DataTypes) {
  var Comment = sequelize.define("comment", {
    text: DataTypes.TEXT(),
    flagged: {type: DataTypes.BOOLEAN(), defaultValue: 0},
    deleted: {type: DataTypes.BOOLEAN(), defaultValue: 0},
    edited: {type: DataTypes.BOOLEAN(), defaultValue: 0}
  }, {
    classMethods: {
      associate: function(models) {
        Comment.belongsTo(models.idea);
        Comment.belongsTo(models.user);
        Comment.hasMany(models.reply);
        //Comment.hasOne(models.comment,{as: 'ReplyingTo', foreignKey: 'replyTo'}),
        Comment.hasMany(models.file, {foreignKey: 'owner_id', constraints: false, scope: {owner_type: 'comment'}});
      }
    },
    instanceMethods: {
      createFile: function(sourceInstance, values, options){
        //THIS WILL PROBABLY NOT WORK.  NOT TESTED.
        //https://github.com/sequelize/sequelize/issues/2091
        values.owner_type = "comment";
        this.constructor.super_.prototype.createFile(sourceInstance, values, options);
      }
    }
  });

  return Comment;
};

//create instance methods.  createFile will need to specify that the owner_type is comment.  Do this on idea too and reply.

//instance method to build the tree of replies.  either return flat or as tree?
//set maxdepth of tree to 2-deep so it doesn't get too wide?  maybe get the reply_to from the UI so it is already
//stored the way we need it to be stored

//on idea, include comments
//on comments, include replies