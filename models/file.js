"use strict";
var fs = require('fs');
var hashFiles = require('hash-files');
var mkdirp = require('mkdirp');
var path = require('path');

var buildAttachmentPath = require('../AttachmentHelpers').buildAttachmentPath;
var getFileName = require('../AttachmentHelpers').getFileName;

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
          //table only if that move/rename is successful.  
          var attachments = [];
          //storing the files in a directory structure based on a hash of the file
          for(var i=0; i<files.length; i++){
            var file = files[i]
            //it doesn't seem like there is any reason to do this asynchronously
            var hash = hashFiles.sync({files: file.path, algorithm: 'sha1'});            
            try{
              //create the directory where the file will be stored
              var attachmentPath = buildAttachmentPath(hash);
              mkdirp.sync(attachmentPath);
              fs.renameSync( files[i].path, path.join(attachmentPath, getFileName(hash)));
              attachments.push({
                  filename: file.originalname,
                  hash: hash,
                  creator: creator,
                  owner_type: type.toLowerCase(),
                  owner_id: id
                 })
            }
            catch(e){
              console.error("Unable to upload file: " + e)
            }
          }
          return File.bulkCreate(attachments).then(function(){
            return File.findAll({where: {owner_id: id}})
          })
       },
       removeAttachments: function(fileIDs){
          //for each file ID, remove it from the 
          //file system if it is only used in this one 
          //idea/comment/reply and delete the entry from the file table;
          var arrFileIDs = fileIDs.split(',');
          var filesToDelete = [];
          var promises = [];

          var handleFile = function(id){
            var attachment;
            return File.findById(id)
            .then(function(file){
              attachment = file;
              return File.count({where: {hash: attachment.hash}})
            })
            .then(function(count){
              //fs uses callbacks, not promises so wrap it in a promise
              return new Promise(function(resolve, reject){
                if(count < 2){
                  //this file is not used anywhere else, remove it
                  var filepath = path.join( buildAttachmentPath(attachment.hash), getFileName(attachment.hash) );
                  fs.unlink(filepath, function(err){
                    if(err) reject()
                    else resolve();
                  })
                }
                else{
                  //this file is used by others, don't remove it
                  resolve();
                }
              })
            })
          }

          arrFileIDs.forEach(function(id){
            promises.push(handleFile(id));
          });

          return Promise.all(promises).then(function(data){
            return File.destroy({where: { id: { $in: arrFileIDs } } })
          })
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