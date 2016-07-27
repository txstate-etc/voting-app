var express = require('express');
var router = express.Router();
var models = require('../models');

router.route('/')
    .get(function(req, res, next) {
        var filter = {};
        if(req.query.comment) filter.comment_id = req.query.comment;
        models.reply.findAll({ where: filter })
        .then(function(replies){
            res.format({
                'text/html': function(){
                    res.send(replies);
                },
                'application/json': function(){
                    res.json(replies);
                }
            }); 
        });
    })

    .post(function(req,res,next){
        models.reply.create({text: req.body.text,
                            approved: req.body.approved,
                            user_id: req.body.user_id,
                            comment_id: req.body.comment_id
        })
        .then(function(reply){
            res.format({
                'text/html': function(){
                   
                },
                'application/json': function(){
                    res.status(201).json(reply);
                }
            }); 
        })
        .catch(function(error){
            next(error);
        });
    });


router.param('reply_id', function(req, res, next, value){
    models.reply.find({
        where: {
            id: req.params.reply_id
        }
    }).then(function(reply){
        if(reply){
            req.reply = reply;
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
        return null; //this removes a warning about a promise not being resolved.  
    }).catch(function(error){
        next(error);
    });
}); 

router.route('/:reply_id')
    .get(function(req, res, next) {
        res.format({
            'text/html': function(){
                
            },
            'application/json': function(){
                res.json(req.reply);
            }
        }); 
    })

    .put(function(req,res,next){
        req.reply.updateAttributes(req.body)
        .then(function(reply){
            res.format({
                'text/html': function(){
                    
                },
                'application/json': function(){
                    res.json(reply);
                }
            });
        }).catch(function(error){
            next(error);
        });
    })

    .delete(function(req,res,next){
        models.reply.destroy({
                where: {
                  id: req.reply.id
                }
            }).then(function(reply){
                res.format({
                    'text/html': function(){
                    
                    },
                    'application/json': function(){
                        res.json(reply);
                    }
                });
            }).catch(function(error){
                next(error);
            });
    });

module.exports = router;   