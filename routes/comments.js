var express = require('express');
var router = express.Router();
var models = require('../models');

router.route('/')
    .get(function(req, res, next) {
        var filter = {};
        if(req.query.user) filter.user_id = req.query.user;
        if(req.query.idea) filter.idea_id = req.query.idea;  
        models.comment.findAll({ where: filter })
        .then(function(comments){
            res.format({
                'text/html': function(){
                    
                },
                'application/json': function(){
                    res.json(comments);
                }
            }); 
        });
    })

    .post(function(req,res,next){
        models.comment.create({text: req.body.text,
                                approved: req.body.approved,
                                user_id: req.body.user_id,
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

    .put(function(req,res,next){
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

    .delete(function(req,res,next){
        models.comment.destroy({
                where: {
                  id: req.comment.id
                }
            }).then(function(comment){
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