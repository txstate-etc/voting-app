var express = require('express');
var router = express.Router();
var models = require('../models');
var path = require('path');
var fileType = require('file-type');
var readChunk = require('read-chunk');

var buildAttachmentPath = require('../AttachmentHelpers').buildAttachmentPath;
var getFileName = require('../AttachmentHelpers').getFileName;

router.route('/')
    //get all files
    .get(function(req, res, next) {
        models.file.findAll({})
        .then(function(files){
            res.json(files);
        });
    })

router.param('file_id', function(req, res, next, value){
    models.file.find({
        where: {
            id: req.params.file_id
        }
    })
    .then(function(file){
        if(file){
            req.file = file;
            next();
        }
        else{
            res.format({
                'text/html': function(){
                    var err = new Error('Not Found');
                    err.status = 404;
                    next(err);
                },
                'application/json': function(){
                    res.status(404).json({message:"Not Found"});
                }
            }); 
        }
        return null;
    })
    .catch(function(err){
        next(err);
    })
});

router.route('/:file_id')
    //get a particular file
    .get(function(req, res, next) {
        var hash = req.file.hash;
        var filepath = path.join( process.env.ATTACHMENTS_DIR, buildAttachmentPath(hash), getFileName(hash));
        var buffer = readChunk.sync(filepath, 0, 262);
        var mimetype = fileType(buffer).mime;
        res.setHeader('Content-type', mimetype);
        res.sendFile(filepath);
    })


module.exports = router;