var express = require('express');
var router = express.Router();
var models = require('../models');
var authenticate = require('./auth').authenticate;
var checkAdmin = require('./auth').admin;

router.route('/')
    .get(function(req, res, next) {
      models.category.findAll({})
        .then(function(categories){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.json(categories);
                }
            }); 
        });
    })

    .post(authenticate, checkAdmin, function(req,res,next){
        models.category.create({name: req.body.name})
        .then(function(category){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.status(201).json(category);
                }
            });
            return null; 
        })
        .catch(function(error){
            next(error);
        });
    });

router.param('category_id', function(req, res, next, value){
    models.category.find({
        where: {
            id: req.params.category_id
        }
    }).then(function(category){
        if(category){
            req.category = category;
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

router.route('/:category_id')
    .get(function(req, res, next) {
        res.format({
            'text/html': function(){
                res.status(404);
                next();
            },
            'application/json': function(){
                res.json(req.category);
            }
        });
        return null; 
    })

    .put(authenticate, checkAdmin, function(req,res,next){
        req.category.updateAttributes({
            name: req.body.name
        }).then(function(category){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.json(category);
                }
            });
            return null;
        }).catch(function(error){
                next(error);
        });
    })

    .delete(authenticate, checkAdmin, function(req,res,next){
        models.category.destroy({
                where: {
                  id: req.category.id
                }
            }).then(function(category){
                res.format({
                    'text/html': function(){
                        res.status(404);
                        next();
                    },
                    'application/json': function(){
                        res.json(category);
                    }
                });
                return null;
            }).catch(function(error){
                next(error);
            });
    });

module.exports = router;