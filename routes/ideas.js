var express = require('express');
var router = express.Router();
var models = require('../models');

router.route('/')
    .get(function(req, res, next) {
        var userFilter = {},
            userRequired = false;
        if(req.query.user){
            userFilter.id = req.query.user;
            userRequired = true;
        } 
        var stageFilter = {},
            stageRequired = false;
        if(req.query.stage){
            stageFilter.id = req.query.stage;
            stageRequired = true;
        }
        var categoryFilter = {},
            categoryRequired = false;
        if(req.query.category) {
            categoryFilter.category_id = req.query.category;
            categoryRequired = true;
        }
        //if these are required false, then all of the ideas are returned even when they are supposed to be filtered.
        //required needs to be true if we are filtering on that model
        //http://docs.sequelizejs.com/en/latest/api/model/#findalloptions-promisearrayinstance
        var eagerLoadModels = [{model: models.user, where: userFilter, required: userRequired},
                               {model: models.stage, where: stageFilter, required: stageRequired}, 
                               {model: models.category, through: {where: categoryFilter, attributes:[]},required: categoryRequired}];
        if(req.query.votes && req.query.votes == "true") eagerLoadModels.push({model: models.vote});
        if(req.query.comments && req.query.comments == "true") eagerLoadModels.push({model: models.comment});
        models.idea.findAll({include: eagerLoadModels})
        .then(function(ideas){
            res.format({
                'text/html': function(){
                    res.render('ideas/index', {layout: 'admin', ideas: ideas });
                },
                'application/json': function(){
                    res.json(ideas);
                }
            }); 
        });
    })

    .post(function(req, res, next){
        models.idea.create({firstname: req.body.firstname, 
                        title: req.body.title, 
                        text: req.body.text, 
                        views: 0, 
                        creator: req.body.creator,  
                        stage_id: req.body.stage})
        .then(function(idea){
            //need to add category too (idea has and belongs to many categories)
            return idea.addCategories(req.body.category)
            .then(function(cat){
                res.format({
                    'text/html': function(){
                        res.redirect('/ideas');  //somehow want to redirect to the tab they were on...
                    },
                    'application/json': function(){
                        res.status(201).json(idea);
                    }
                });
            })
            .catch(function(error){
                next(error);
            });
        })
        .catch(function(error){
            next(error);
        });
    });

/* get NEW idea page */
router.get('/new', function(req, res) {
    models.category.findAll({})
    .then(function(categories){
         return models.stage.findAll({})
        .then(function(stages){
            res.format({
                'text/html': function(){
                    res.render('ideas/form', {
                        layout: 'admin',
                        "title" : "Add Idea",
                        "action" : "/ideas",
                        "method" : "POST",
                        "categories" : categories,
                        "stages" : stages
                    });
                },
                'default': function() {
                    // log the request and respond with 406
                    res.status(406).send('Not Acceptable');
                }
            }); 
        })
        .catch(function(error){
            next(error);
        });
        
    })
    .catch(function(error){
        next(error);
    });   
});


router.param('idea_id', function(req, res, next, value){
    models.idea.find({
        where: {
            id: req.params.idea_id
        },
        include: [{model: models.user},{model: models.stage},{model: models.category}]
    }).then(function(idea){
        if(idea){
            req.idea = idea;
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

router.route('/:idea_id')
    .get(function(req, res, next) {
        //update the view count
        req.idea.increment('views')
        .then(function(){
            res.format({
                'text/html': function(){
                    res.render('ideas/show', {layout: 'admin', idea: req.idea });
                },
                'application/json': function(){
                    res.json(req.idea);
                }
            }); 
        });
    })

    
     .put(function(req,res,next){
        req.idea.updateAttributes(req.body)
        .then(function(idea){
            return idea.setCategories(req.body.category)
            .then(function(cat){
                res.json(idea);
            })
            .catch(function(error){
                next(error);
            });
        })
        .catch(function(error){
            next(error);
        });
     })

    .delete(function(req,res,next){
        models.idea.destroy({
                where: {
                  id: req.idea.id
                }
            }).then(function(idea){
                res.format({
                    'text/html': function(){
                    res.render('ideas/index', {layout: 'admin', notice: "Idea successfully deleted"});
                    },
                    'application/json': function(){
                        res.json(idea);
                    }
                });
            }).catch(function(error){
                next(error);
            });
    });

router.route('/:idea_id/edit')
    .get(function(req, res, next){
        return models.category.findAll({})
        .then(function(categories){
            return models.stage.findAll({})
            .then(function(stages){
                res.format({
                    'text/html': function(){
                        res.render('ideas/form', {
                            layout: 'admin',
                            "idea": req.idea,
                            "title": "Edit Idea",
                            "method": "PUT",
                            "action": "/ideas/" + req.idea.id,
                            "categories" : categories,
                            "stages" : stages
                        });
                    },
                    'application/json': function(){
                        // log the request and respond with 406
                        res.status(406).send('Not Acceptable');
                    }
                });
            })
            .catch(function(error){
                next(error);
            });
        })
        .catch(function(error){
            next(error);
        });
    });

module.exports = router;