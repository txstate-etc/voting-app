var express = require('express');
var router = express.Router();
var models = require('../models');
var authenticate = require('./auth').authenticate;
var checkAdmin = require('./auth').admin;

router.route('/')
    .get(function(req, res, next) {
        var filter = {deleted: false};
        if(req.query.user) filter.user_id = req.query.user;
        if(req.query.idea) filter.idea_id = req.query.idea;

        var findOptions = {};
        
        findOptions.include = [{model: models.user}, {model: models.idea}];
        if(req.query.replies && req.query.replies == "true") findOptions.include.push({model: models.reply, include:[{model: models.user}]});

        if(req.query.flagged && req.query.flagged == "true"){
            //get flagged comments.  Also need comments which have a flagged reply.
            models.reply.findAll({attributes: ['comment_id'], 
                      where: {flagged: true}, 
                      include:[{model: models.comment, attributes: [], where: {flagged: false}}]})
            .then(function(replies){
                //these are the flagged replies to unflagged comments
                var IDs = [];
                for(var i=0; i<replies.length; i++){
                    IDs.push(replies[i].comment_id);
                }
                filter.$or = [
                            {
                              flagged: {
                                $eq: false
                              }
                            },
                            {
                              id: {
                                $in: IDs
                              }
                            }
                          ]
                findOptions.where = filter;
                models.comment.findAll(findOptions)
                .then(function(comments){
                    res.json(comments);
                });
            })
        }
        else{
            findOptions.where = filter;
            models.comment.findAll(findOptions)
            .then(function(comments){
                res.json(comments);
            });
        }
    })

    .post(authenticate, function(req,res,next){
        var author = req.session["user_id"];
        if(author){
            models.comment.create({text: req.body.text,
                                    flagged: false,
                                    deleted: false,
                                    user_id: author,
                                    idea_id: req.body.idea_id
            })
            .then(function(comment){
                res.format({
                    'text/html': function(){
                       
                    },
                    'application/json': function(){
                        res.status(201).json(comment);
                    }
                }); 
            })
            .catch(function(error){
                next(error);
            });
        }
        else{
            console.log("user is not logged in")
            res.status(302).json({message: "Login required"});
        }
    });

router.param('comment_id', function(req, res, next, value){
    models.comment.find({
        where: {
            id: req.params.comment_id
        }
    }).then(function(comment){
        if(comment){
            req.comment = comment;
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
    }).catch(function(error){
        next(error);
    });
});

router.route('/:comment_id')
    .get(function(req, res, next) {
        res.format({
            'text/html': function(){
                
            },
            'application/json': function(){
                res.json(req.comment);
            }
        }); 
    })

    .put(authenticate, checkAdmin, function(req,res,next){
        req.comment.updateAttributes(req.body)
        .then(function(comment){
            res.format({
                'text/html': function(){
                    
                },
                'application/json': function(){
                    res.json(comment);
                }
            });
        }).catch(function(error){
            next(error);
        });
    })

    .delete(authenticate, checkAdmin, function(req,res,next){
        req.comment.updateAttributes({deleted: true})
        .then(function(comment){
            res.format({
                'text/html': function(){
                
                },
                'application/json': function(){
                    res.json(comment);
                }
            });
        }).catch(function(error){
            next(error);
        });
    });

module.exports = router;