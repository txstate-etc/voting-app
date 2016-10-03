var express = require('express');
var router = express.Router();
var models = require('../models');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })

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
        if(req.query.comments && req.query.comments == "true") {
            eagerLoadModels.push({model: models.comment,  include: [{model: models.reply}]});
        }
        else{
            //Even if they don't want the comments/replies, they might want the comment count.  This will just return the IDs of 
            //the comments and replies so they can be counted but there isn't as much unneeded information being returned.
            //TODO: Return the comment count instead of the comments.  A method to do this is discussed here:
            //https://github.com/sequelize/sequelize/issues/222  but will multiply the comment count by the number of categories
            //for ideas in multiple categories.
            eagerLoadModels.push({model: models.comment, attributes: ['id'], include: [{model: models.reply, attributes: ['id']}]});
        }
        if(req.query.files && req.query.files == "true") {
            eagerLoadModels.push({model: models.file}); 
        }
        models.idea.findAll({include: eagerLoadModels})
        .then(function(ideas){
            res.format({
                'text/html': function(){
                    res.status(404);
                    next();
                },
                'application/json': function(){
                    res.json(ideas);
                }
            }); 
        });
    })

    //if the idea is inserted but adding attachments fails, should the idea be removed?
    .post(upload.array('attachments'), function(req, res, next){
        var creator = req.session["user_id"];
        var newIdea;
        if(creator){
            models.idea.create({firstname: req.body.firstname,
                                title: req.body.title,
                                text: req.body.text,
                                views: 0,
                                creator: creator,
                                stage_id: req.body.stage})
            .then(function(idea){
                newIdea = idea;
                //need to add category too (idea has and belongs to many categories)
                return idea.addCategories((typeof req.body.category === "string") ? req.body.category.split(',') : req.body.category )
            })
            .then(function(category){
                //handle attachments if they included any
                if(req.files && req.files.length > 0){
                    return models.file.saveAttachment(newIdea.id, creator, "idea", req.files)
                }
                else{
                    //no files to save
                    return Promise.resolve();
                }
            })
            .then(function(){
                res.status(201).json(newIdea);
                return null; 
            })
            .catch(function(err){
                console.error(err);
                next(err);
            })
        }
        else{
            res.status(302).json({message: "Login required"});
        }
    });

router.param('idea_id', function(req, res, next, value){
    models.idea.find({
        where: {
            id: req.params.idea_id
        },
        include: [{model: models.user},
                  {model: models.stage},
                  {model: models.category},
                  {model: models.comment, include: [{model: models.reply}]},
                  {model: models.file}]
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
        res.format({
            'text/html': function(){
                res.status(404);
                next();
            },
            'application/json': function(){
                res.json(req.idea);
            }
        });
    })

    .put(upload.array('attachments'), function(req,res,next){
        var editedIdea;
        req.idea.updateAttributes(req.body)
        .then(function(idea){
            editedIdea = idea;
            if(req.body.category){
                return idea.setCategories((typeof req.body.category === "string") ? req.body.category.split(',') : req.body.category )
            }
            else{
                return Promise.resolve();
            }
        })
        .then(function(category){
            if(req.files && req.files.length > 0){
                //TODO: the creator should probably be the person logged in, not necessarily the
                //person who created the idea in the first place
                return models.file.saveAttachment(editedIdea.id, editedIdea.creator, "idea", req.files)
            }
            else{
                return Promise.resolve();
            }
        })
        .then(function(file){
            if(req.body.deleteAttachments){
                return models.file.removeAttachments(req.body.deleteAttachments)
            }
            else{
                return Promise.resolve();
            }
        })
        .then(function(arg){
            res.status(200).json(editedIdea);
            return null;
        })
        .catch(function(err){
            console.error(err);
            next(err);
        })
    })
     
    .delete(function(req,res,next){
        models.idea.destroy({
                where: {
                  id: req.idea.id
                }
            }).then(function(idea){
                res.format({
                    'text/html': function(){
                        res.status(404);
                        next();
                    },
                    'application/json': function(){
                        res.json(idea);
                    }
                });
                return null;
            }).catch(function(error){
                next(error);
            });
    });

module.exports = router;