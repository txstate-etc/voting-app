var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');
var authenticate = require('./auth').authenticate;

//A user should only be able to modify or delete a vote if it is their vote. or they are an admin?

router.route('/')
    .get(function(req, res, next) {
      var filter = {};
      if(req.query.user) filter.user_id = req.query.user;
      if(req.query.idea) filter.idea_id = req.query.idea;  
      models.vote.findAll({ where: filter })
        .then(function(votes){
            res.format({
                'text/html': function(){
                    res.render('votes/index', { votes: votes });
                },
                'application/json': function(){
                    res.json(votes);
                }
            }); 
        });
    })

    .post(authenticate, function(req,res,next){
        var user_id = req.session["user_id"];
        if(user_id){
            models.vote.createOrUpdateVote(req.body.idea_id, user_id, req.body.score)
            .then(function(result){
                var status = result.created ? 201 : 200;
                res.format({
                    'text/html': function(){
                       res.status(status).end();
                    },
                    'application/json': function(){
                        res.status(status).json(result);
                    }
                });
                return null;
            })
            .catch(function (err) {
                next(error);
            });
        }
        else{
            console.log("user is not logged in")
            res.status(302).json({message: "Login required"});
        }
    });

router.param('vote_id', function(req, res, next, value){
    models.vote.find({
        where: {
            id: req.params.vote_id
        }
    }).then(function(vote){
        if(vote){
            req.vote = vote;
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
    }).catch(function(error){
        next(error);
    });
});

router.route('/:vote_id')
    .get(function(req, res, next) {
        res.format({
            'text/html': function(){
                res.render('votes/show', { vote: req.vote });
            },
            'application/json': function(){
                res.status(200).json(req.vote);
            }
        }); 
    })

    .put(authenticate, function(req,res,next){
        req.vote.updateAttributes(req.body)
        .then(function(vote){
            res.format({
                'text/html': function(){
                    res.render('votes/index', {notice: "Vote successfully updated"});
                },
                'application/json': function(){
                    res.json(vote);
                }
            });
        }).catch(function(error){
                next(error);
        });
    })

    .delete(authenticate, function(req,res,next){
        models.vote.destroy({
                where: {
                  id: req.vote.id
                }
            }).then(function(vote){
                res.format({
                    'text/html': function(){
                        res.status(200).end()
                    },
                    'application/json': function(){
                        res.status(200).json({message: "vote deleted"});
                    }
                });
                return null;
            }).catch(function(error){
                next(error);
            });
    });

module.exports = router;