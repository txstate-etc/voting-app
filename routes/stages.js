var express = require('express');
var router = express.Router();
var models = require('../models');


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

    .post(function(req,res,next){
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

/* get NEW stage page */
router.get('/new', function(req, res) {
    var stage = models.stage.build({name: null});
    res.format({
        'text/html': function(){
            res.render('stages/form', { 
                layout: 'admin',
                "title" : "Add Stage",
                "action" : "/stages",
                "method" : "POST"
            });
        },
        'application/json': function(){
            //this just sends an empty stage with id and name null
            res.json(stage);
        }
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

    .put(function(req,res,next){
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

    .delete(function(req,res,next){
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