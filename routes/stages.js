var express = require('express');
var router = express.Router();
var models = require('../models');
var authenticate = require('./auth').authenticate;
var checkAdmin = require('./auth').admin;

router.route('/')
    .get(function(req, res, next) {
      models.stage.findAll({})
        .then(function(stages){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.json(stages);
                }
            }); 
        });
    })

    .post(authenticate, checkAdmin, function(req,res,next){
        models.stage.create({name: req.body.name})
        .then(function(stage){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.status(201).json(stage);
                }
            }); 
            return null;
        })
        .catch(function(error){
            next(error);
        });
    });


//for routes like /stages/<id> check if the id exists
//if not, send back 404.  otherwise, move on to the router
router.param('stage_id', function(req, res, next, value){
    models.stage.find({
        where: {
            id: req.params.stage_id
        }
    }).then(function(stage){
        if(stage){
            req.stage = stage;
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

router.route('/:stage_id')
    .get(function(req, res, next) {
        res.format({
            'text/html': function(){
                res.status(404);
                next();
            },
            'application/json': function(){
                res.json(req.stage);
            }
        });
        return null; 
    })

    .put(authenticate, checkAdmin, function(req,res,next){
        req.stage.updateAttributes({
            name: req.body.name
        }).then(function(stage){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.json(stage);
                }
            });
            return null;
        }).catch(function(error){
                next(error);
        });
    })

    .delete(authenticate, checkAdmin, function(req,res,next){
        req.stage.getIdeas()
        .then(function(ideas){
            if(ideas.length > 0){
                var message = "Can't delete stage " + req.stage.name + " because it still contains ideas.";
                console.log(message)
                res.status(409).json({message: message})
                return null;
            }
            else{
                models.stage.destroy({
                    where: {
                        id: req.stage.id
                    }
                })
                .then(function(stage){
                    res.json(stage)
                })
                .catch(function(error){
                    next(error)
                })
            }
        })
    });

module.exports = router;