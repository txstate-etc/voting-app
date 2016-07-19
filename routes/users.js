var express = require('express');
var router = express.Router();
var models = require('../models');

//flash messages
//JSON return on edit and new
//JSON return on delete

router.route('/')
    .get(function(req, res, next) {
      models.user.findAll({})
        .then(function(users){
            res.format({
                'text/html': function(){
                    res.render('users/index', {layout: 'admin', users: users });
                },
                'application/json': function(){
                    res.json(users);
                }
            }); 
        });
    })

    .post(function(req,res,next){
        models.user.create({firstname: req.body.firstname, 
                        lastname: req.body.lastname, 
                        netid: req.body.netid, 
                        admin: req.body.admin, 
                        commentMod: req.body.commentMod,  
                        ideaMod: req.body.ideaMod})
        .then(function(user){
            res.format({
                'text/html': function(){
                   res.redirect('/users');
                },
                'application/json': function(){
                    res.status(201).json(user);
                }
            }); 
        })
        .catch(function(error){
            next(error);
        });
    });

/* get NEW user page */
router.get('/new', function(req, res) {
    var user = models.user.build({firstname: null,lastname: null, netid: null, admin:0, commentMod: 0, ideaMode:0});
    res.format({
        'text/html': function(){
            res.render('users/form', {
                layout: 'admin',
                "title" : "Add User",
                "action" : "/users",
                "method" : "POST"
            });
        },
        'application/json': function(){
            //this just sends an empty user 
            res.json(user);
        }
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
    .get(function(req, res, next) {
        res.format({
            'text/html': function(){
                res.render('users/show', {layout: 'admin', user: req.user });
            },
            'application/json': function(){
                res.json(req.user);
            }
        }); 
    })

    .put(function(req,res,next){
        //if the booleans are missing from req.body, they need to be false.
        //it is probably the responsibility of the front end to make sure these are correct...
        if(!req.body.admin) req.body.admin = false;
        if(!req.body.commentMod) req.body.commentMod = false;
        if(!req.body.ideaMod) req.body.ideaMod = false;
        req.user.updateAttributes(req.body)
        .then(function(user){
            res.format({
                'text/html': function(){
                    res.render('users/index', {layout: 'admin', notice: "User successfully updated"});
                },
                'application/json': function(){
                    res.json(user);
                }
            });
        }).catch(function(error){
                next(error);
        });
    })

    .delete(function(req,res,next){
        models.user.destroy({
                where: {
                  id: req.user.id
                }
            }).then(function(user){
                res.format({
                    'text/html': function(){
                    res.render('users/index', {layout: 'admin', notice: "User successfully deleted"});
                    },
                    'application/json': function(){
                        res.json(user);
                    }
                });
            }).catch(function(error){
                next(error);
            });
    });

router.route('/:user_id/edit')
    .get(function(req, res, next){
        res.format({
            'text/html': function(){
                res.render('users/form', {
                    layout: 'admin',
                    "user": req.user,
                    "title": "Edit User",
                    "method": "PUT",
                    "action": "/users/" + req.user.id
                });
            },
            'application/json': function(){
               res.json(req.user);
            }
        });
    });


module.exports = router;
