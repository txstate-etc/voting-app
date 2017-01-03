var express = require('express');
var router = express.Router();
var models = require('../models');
var authenticate = require('./auth').authenticate;
var checkAdmin = require('./auth').admin;

router.route('/')
    .get(function(req, res, next) {
        var options = {}
        options.where = {deleted: false}
        //include deleted users too
        if(req.query.deleted && req.query.deleted == "true")
            options.where = {}
        //search for net id's containing a search term
        if(req.query.q){
            options.where.netid = {$like: '%' + req.query.q + '%'}
        }
        //pagination
        if(req.query.offset && req.query.limit){
            options.offset = parseInt(req.query.offset)
            options.limit = parseInt(req.query.limit)
        }
        models.user.findAndCountAll(options)
        .then(function(users){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.set('X-total-count', users.count);
                    res.json(users.rows);
                }
            }); 
        });
    })

    .post(authenticate, checkAdmin, function(req,res,next){
        console.log(req.body)
        models.user.create({firstname: req.body.firstname, 
                        lastname: req.body.lastname, 
                        netid: req.body.netid,
                        affiliation: req.body.affiliation, 
                        admin: req.body.admin, 
                        commentMod: req.body.commentMod,  
                        ideaMod: req.body.ideaMod})
        .then(function(user){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.status(201).json(user);
                }
            }); 
            return null;
        })
        .catch(function(error){
            next(error);
        });
    });

router.param('user_id', function(req, res, next, value){
    models.user.find({
        where: {
            id: req.params.user_id
        }
    }).then(function(user){
        if(user){
            req.user = user;
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

router.route('/:user_id')
    .get(authenticate, checkAdmin, function(req, res, next) {
        res.format({
            'text/html': function(){
                res.status(404);
                next();
            },
            'application/json': function(){
                res.json(req.user);
            }
        }); 
    })

    .put(authenticate, checkAdmin, function(req,res,next){
        //if the booleans are missing from req.body, they need to be false.
        //it is probably the responsibility of the front end to make sure these are correct...
        if(!req.body.admin) req.body.admin = false;
        if(!req.body.commentMod) req.body.commentMod = false;
        if(!req.body.ideaMod) req.body.ideaMod = false;
        req.user.updateAttributes(req.body)
        .then(function(user){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.json(user);
                }
            });
            return null;
        }).catch(function(error){
                next(error);
        });
    })

    .delete(authenticate, checkAdmin, function(req,res,next){
        req.user.updateAttributes({deleted: true})
        .then(function(count){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.json(count);
                }
            });
            return null;
        }).catch(function(error){
            next(error);
        });
    });

module.exports = router;