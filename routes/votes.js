var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');

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

    .post(function(req,res,next){
        models.vote.createOrUpdateVote(req.body.idea_id, req.body.user_id, req.body.score)
        .then(function(voteCreated){
            var status = voteCreated ? 201 : 200;
            res.format({
                'text/html': function(){
                   res.status(status).end();
                },
                'application/json': function(){
                    res.status(status).json(voteCreated);
                }
            }); 
        })
        .catch(function (err) {
            next(error);
        });
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

    .put(function(req,res,next){
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

    .delete(function(req,res,next){
        models.vote.destroy({
                where: {
                  id: req.vote.id
                }
            }).then(function(vote){
                res.format({
                    'text/html': function(){
                    res.render('votes/index', {notice: "Vote successfully deleted"});
                    },
                    'application/json': function(){
                        res.json(vote);
                    }
                });
            }).catch(function(error){
                next(error);
            });
    });

module.exports = router;