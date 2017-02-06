var express = require('express');
var router = express.Router();
var models = require('../models');
var authenticate = require('./auth').authenticate;
var checkAdmin = require('./auth').admin;
var moment = require('moment');

router.route('/')
    .get(checkAdmin, function(req, res, next) {
        var options = {}
        var filter = {}
        if(req.query.startdate) filter.updated_at = {$gte: moment.utc(req.query.startdate)}
        if(req.query.offset && req.query.limit){
            options.offset = parseInt(req.query.offset);
            options.limit = parseInt(req.query.limit)
        }
        options.where = filter;
        options.include = [{model: models.user}]
        models.note.findAndCountAll(options)
        .then(function(result){
            res.set('X-total-count', result.count);
            var notes = result.rows;
            var commentIDs = [], replyIDs = [];
            for(var i=0; i < notes.length; i++){
                if(notes[i].owner_type == "comment"){
                    commentIDs.push(notes[i].owner_id);
                }
                else if(notes[i].owner_type == "reply"){
                    replyIDs.push(notes[i].owner_id)
                }
            }
            models.comment.findAll({where: { id: {$in: commentIDs}}})
            .then(function(comments){
                var rejectedComments = comments;
                models.reply.findAll({where: { id: {$in: replyIDs}}})
                .then(function(replies){
                    var rejectedReplies = replies;
                    for(var i=0; i<notes.length; i++){
                        if(notes[i].owner_type == "comment"){
                            var comment = rejectedComments.filter(function(rc){
                                return rc.id == notes[i].owner_id;
                            })
                            if(comment.length > 0){
                                notes[i].setDataValue('comment', comment[0]);
                            }
                        }
                        else if(notes[i].owner_type == "reply"){
                            var reply = rejectedReplies.filter(function(rr){
                                return rr.id == notes[i].owner_id;
                            })
                            if(reply.length > 0){
                                notes[i].setDataValue('comment', reply[0]);
                            }
                        }
                    }
                    res.json(notes);
                })
            })
        })
        .catch(function(err){
            next(err);
        })
    })

    .post(checkAdmin,function(req, res, next){
        var author = req.session["user_id"];
        if(author){
            models.note.create({
                text: req.body.text,
                creator: author,
                owner_id: req.body.owner_id,
                owner_type: req.body.owner_type
            })
            .then(function(note){
                res.status(201).json(note);
            })
            .catch(function(err){
                next(err);
            })
        }
        else{
            console.log("user is not logged in")
            res.status(302).json({message: "Login required"});
        }
    })

router.param('note_id', function(req, res, next, value){
    models.note.find({
        where: {
            id: req.params.note_id
        }
    }).then(function(note){
        if(note){
            req.note = note;
            next();
        }
        else{
            res.status(404).json({message:"Not Found"});
        }
        return null; 
    }).catch(function(error){
        next(error);
    });
});

router.route('/:note_id')
    .get(checkAdmin, function(req, res, next) {
        res.json(req.note);
    })

    .put(checkAdmin, function(req, res, next){
        req.note.updateAttributes(req.body)
        .then(function(note){
            res.json(note);
        }).catch(function(error){
            next(error);
        });
    })

    .delete(checkAdmin, function(req, res, next){
        models.vote.destroy({
            where: {
              id: req.note.id
            }
        }).then(function(count){
            res.status(200).json({message: "note deleted"});
            return null;
        }).catch(function(error){
            next(error);
        });
    })
    

module.exports = router;