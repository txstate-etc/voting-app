var express = require('express');
var router = express.Router();
var models = require('../models');
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })
var authenticate = require('./auth').authenticate;
var checkAdmin = require('./auth').admin;
var formatSearchWords = require('./helpers').formatSearchWords;

router.route('/')
    .get(function(req, res, next) {
        var options = {};
        var eagerLoadedModels = [];

        //TODO: make sure query string stuff is encoded.  Make sure user, stage, and category are numbers.
        var count_query = "SELECT COUNT(*) as count";
        count_query += " FROM ideas i LEFT JOIN (SELECT idea_id as id, SUM(score) as total_votes FROM votes GROUP BY idea_id) iv ON i.id = iv.id";
        if(req.query.user) count_query += " INNER JOIN users u on i.creator = u.id AND u.id= " + req.query.user;
        if(req.query.stage) count_query += " INNER JOIN stages s on i.stage_id = s.id AND s.id= " + req.query.stage;
        if(req.query.category) count_query += " INNER JOIN categories_ideas ci ON ci.idea_id = i.id INNER JOIN categories c ON c.id = ci.category_id AND category_id = " + req.query.category;
        if(!req.query.stageRequired || req.query.stageRequired == "true") count_query += " INNER JOIN stages on stages.id = i.stage_id"
        if(req.query.search){
            count_query += " WHERE MATCH(text) AGAINST('" + req.query.search + "') OR MATCH(title) AGAINST('" + req.query.search + "')"
        }

        models.sequelize.query(count_query,{ type: models.sequelize.QueryTypes.SELECT })
        .then(function(result){
            res.set('X-total-count', result[0].count);
            var query = "SELECT i.id, iv.total_votes";
            if(req.query.user) query+= ", u.id as user";
            if(req.query.stage) query += ", s.id as stage";
            query += " FROM ideas i LEFT JOIN (SELECT idea_id as id, SUM(score) as total_votes FROM votes GROUP BY idea_id) iv ON i.id = iv.id"
            if(req.query.user) query += " INNER JOIN users u on i.creator = u.id AND u.id= " + req.query.user;
            if(req.query.stage) query += " INNER JOIN stages s on i.stage_id = s.id AND s.id= " + req.query.stage;
            if(req.query.category) query += " INNER JOIN categories_ideas ci ON ci.idea_id = i.id INNER JOIN categories c ON c.id = ci.category_id AND category_id = " + req.query.category;
            if(!req.query.stageRequired || req.query.stageRequired == "true") query += " INNER JOIN stages on stages.id = i.stage_id"
            if(req.query.search){
                query += " WHERE MATCH(text) AGAINST('" + req.query.search + "') OR MATCH(title) AGAINST('" + req.query.search + "')"
            }
            query += " ORDER BY total_votes DESC";
            //pagination
            if(req.query.offset && req.query.limit){
                query += " LIMIT "+ req.query.offset + ", " + req.query.limit;
            }
            models.sequelize.query(query,{ type: models.sequelize.QueryTypes.SELECT })
            .then(function(results){
                var vote_counts = results;
                var IDs = [];
                for(var i=0; i<vote_counts.length; i++){
                    IDs.push(vote_counts[i].id);
                }

                //at this point, I have the id for the ideas that have been filtered by category, stage, and user
                //they are sorted by number of votes, descending.  Should be easy to order by date if necessary.
                 var userAttributes = ['id', 'affiliation'];
                //unless they are an admin, we don't want to send back user information with the ideas
                if(req.session.admin){
                    userAttributes = ['id', 'firstname', 'lastname', 'netid', 'affiliation', 'admin', 'commentMod', 'ideaMod', 'created_at', 'updated_at'];
                }
                //load user
                eagerLoadedModels.push({model: models.user, attributes: userAttributes});
                //load stage
                eagerLoadedModels.push({model: models.stage});
                //load categories
                eagerLoadedModels.push({model: models.category, through: {attributes:[]}})
                //load votes model if requested
                if(req.query.votes && req.query.votes == "true") eagerLoadedModels.push({model: models.vote});
                
                //load comments and replies if requested
                if(req.query.comments && req.query.comments == "true") {
                    eagerLoadedModels.push({model: models.comment, include: [{model: models.reply, include: [{model: models.user, attributes: userAttributes}]},{model: models.user, attributes: userAttributes}]});
                }
                else{
                    //Even if they don't want the comments/replies, they might want the comment count.  This will just return the IDs of 
                    //the comments and replies so they can be counted but there isn't as much unneeded information being returned.
                    //TODO: Return the comment count instead of the comments.  A method to do this is discussed here:
                    //https://github.com/sequelize/sequelize/issues/222  but will multiply the comment count by the number of categories
                    //for ideas in multiple categories.
                    eagerLoadedModels.push({model: models.comment, attributes: ['id'], include: [{model: models.reply, attributes: ['id']}]});
                }

                //load files if requested
                if(req.query.files && req.query.files == "true") {
                    eagerLoadedModels.push({model: models.file}); 
                }

                var whereClause = { id: {$in: IDs}};

                models.idea.findAll({
                    where: whereClause,
                    include: eagerLoadedModels
                })
                .then(function(results){
                    var ideas = [];
                    for(var i=0; i<vote_counts.length; i++){
                        var id = vote_counts[i].id;
                        for(var j=0; j<results.length; j++){
                            if(results[j].id == id){
                                results[j].setDataValue('total_votes', (vote_counts[i].total_votes || 0) )
                                ideas.push(results[j]);
                            }
                        }
                    }
                    res.json(ideas)
                })
            })
        })
    })

    //if the idea is inserted but adding attachments fails, should the idea be removed?
    .post(authenticate, upload.array('attachments'), function(req, res, next){
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
                  {model: models.vote},
                  {model: models.comment, required: false, where: {deleted: false}, include: [{model: models.reply, required: false, where: {deleted: false}, required: false, include: [{model: models.user, attributes: ['id', 'affiliation']}]}, 
                                                    {model: models.user, attributes: ['id', 'affiliation']}]},
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

    //need to be able to PUT without being logged in so that the view count can be updated... but don't want to allow just
    //anyone to update anything
    .put(upload.array('attachments'), function(req,res,next){
        var editedIdea;
        if(req.session.user_id) {
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
        }
        else{
            //allow unauthenticated users to update the view count
            if(req.body.views){
                req.idea.updateAttributes({views: req.body.views})
                .then(function(idea){
                    res.status(200).json(idea);
                })
            }
            else{
                //anything else they want to update requires them to be logged in
                res.status(302).json({message: "Login required"});
            }
        }
    })
     
    .delete(authenticate, checkAdmin, function(req,res,next){
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

router.route('/batch')
    .patch(function(req, res, next) {
        models.sequelize.transaction(function (t) {
            return models.sequelize.Promise.each(req.body, function (itemToUpdate) {
                var id= itemToUpdate.id
                var data = itemToUpdate.data
                console.log("id is " + id  + " and data is " + JSON.stringify(data))
                return models.idea.find({
                    where: {
                        id: id
                    }
                })
                .then(function(idea){
                    console.log("updating attributes")
                    return idea.updateAttributes(data,  { transaction: t })
                })
                .then(function(idea){
                    if(data.category){
                        console.log("updating category")
                        return idea.setCategories((typeof data.category === "string") ? data.category.split(',') : data.category, { transaction: t } )
                    }
                    else{
                        return Promise.resolve();
                    }
                })
          });
        }).then(function (result) {
          // Transaction has been committed
          // result is whatever the result of the promise chain returned to the transaction callback
          res.json(result)
        }).catch(function (err) {
            console.log(err)
          // Transaction has been rolled back
          // err is whatever rejected the promise chain returned to the transaction callback
        });
    })

module.exports = router;