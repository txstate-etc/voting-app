"use strict";
var fs = require('fs');
var hashFiles = require('hash-files');
var mkdirp = require('mkdirp');
var path = require('path');

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
       saveAttachment: function(id, creator, type, files){
          //need to move the attachment to it's new location and save it in the Files
          //table only if that move/rename is successful.  bulkCreate won't work
          var attachments = [];
          //storing the files in a directory structure based on a hash of the file
          var chunkSize=3;
          var depth = 3;
          for(var i=0; i<files.length; i++){
            var file = files[i]
            //it doesn't seem like there is any reason to do this asynchronously
            var hash = hashFiles.sync({files: file.path, algorithm: 'sha1'});
            var attachment_path = process.env.ATTACHMENTS_DIR;
            for(var j=0; j<depth; j++){
              attachment_path = path.join(attachment_path, hash.substring((j*chunkSize),((j+1)*chunkSize)));
            }
            var fileName = hash.substring( chunkSize * depth );
            //create the directory where the file will be stored
            try{
              mkdirp.sync(attachment_path);
              fs.renameSync( files[i].path, path.join( attachment_path,fileName ));
              attachments.push({
                  filename: file.originalname,
                  hash: hash,
                  creator: creator,
                  owner_type: type.toLowerCase(),
                  owner_id: id
                 })
            }
            catch(e){
              console.error("Unable to upload file")
            }
          }
          return File.bulkCreate(attachments).then(function(){
            return File.findAll({where: {owner_id: id}})
          })
       },
       removeAttachments: function(fileIDs){
          var arrFileIDs = fileIDs.split(',');
          //TODO:  Actually remove the file from the file system
          var filesToDelete = [];
          arrFileIDs.forEach(function(id){
            //TODO: check if the file is used by someone else before removing it.
            //this just removes the entry in the files table, not the actual file
            filesToDelete.push(id);
          });
          return File.destroy({where: { id: { $in: filesToDelete } } })
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