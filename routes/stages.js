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
                    res.render('stages/index', {layout: 'admin', stages: stages });
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
                   res.redirect('/stages');
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
                res.render('stages/show', { layout: 'admin', stage: req.stage });
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
                    //redirect instead of render?  can I send a message with that?
                    res.render('stages/index', {layout: 'admin', notice: "Stage successfully updated"});
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
        models.stage.destroy({
                where: {
                  id: req.stage.id
                }
            }).then(function(count){
                //destroy returns the number of items deleted
                res.format({
                    'text/html': function(){
                        //redirect instead of render?  can I send a message with that?
                    res.render('stages/index', {layout: 'admin', notice: "Stage successfully deleted"});
                    },
                    'application/json': function(){
                        res.json(count); //redirect?  return 204
                    }
                });
                return null;
            }).catch(function(error){
                next(error);
            });
    });

router.route('/:stage_id/edit')
    .get(function(req, res, next){
        res.format({
            'text/html': function(){
                res.render('stages/form', {
                    layout: 'admin',
                    "stage": req.stage,
                    "title": "Edit Stage",
                    "method": "PUT",
                    "action": "/stages/" + req.stage.id
                });
            },
            'application/json': function(){
               //what JSON return makes sense?  Calendar doesn't have one.
               res.json(req.stage);
            }
        });

    });

module.exports = router;