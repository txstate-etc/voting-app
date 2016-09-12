var express = require('express');
var router = express.Router();
var models = require('../models');

//flash messages
//JSON return on edit and new
//JSON return on delete

router.route('/')
    .get(function(req, res, next) {
      models.category.findAll({})
        .then(function(categories){
            res.format({
                'text/html': function(){
                    res.render('categories/index', {layout: 'admin', categories: categories });
                },
                'application/json': function(){
                    res.json(categories);
                }
            }); 
        });
    })

    .post(function(req,res,next){
        models.category.create({name: req.body.name})
        .then(function(category){
            res.format({
                'text/html': function(){
                   res.redirect('/categories');
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

/* get NEW category page */
router.get('/new', function(req, res) {
    var category = models.category.build({name: null});
    res.format({
        'text/html': function(){
            res.render('categories/form', {
                layout: 'admin',
                "title" : "Add Category",
                "action" : "/categories",
                "method" : "POST"
            });
        },
        'application/json': function(){
            //this just sends an empty stage with id and name null
            res.json(category);
        }
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
                res.render('categories/show', {layout: 'admin', category: req.category });
            },
            'application/json': function(){
                res.json(req.category);
            }
        });
        return null; 
    })

    .put(function(req,res,next){
        req.category.updateAttributes({
            name: req.body.name
        }).then(function(category){
            res.format({
                'text/html': function(){
                    res.render('categories/index', {layout: 'admin', notice: "Category successfully updated"});
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

    .delete(function(req,res,next){
        models.category.destroy({
                where: {
                  id: req.category.id
                }
            }).then(function(category){
                res.format({
                    'text/html': function(){
                    res.render('categories/index', {layout: 'admin', notice: "Category successfully deleted"});
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

router.route('/:category_id/edit')
    .get(function(req, res, next){
        res.format({
            'text/html': function(){
                res.render('categories/form', {
                    layout: 'admin',
                    "category": req.category,
                    "title": "Edit Category",
                    "method": "PUT",
                    "action": "/categories/" + req.category.id
                });
            },
            'application/json': function(){
               res.json(req.category);
            }
        });

    });

module.exports = router;