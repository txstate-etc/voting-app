var expect = require('chai').expect;
var myapp = require('../app.js');
var request = require('supertest')(myapp);
var sequelize_fixtures = require('sequelize-fixtures');
var sequelize = require("../models").sequelize;
var models = {
    Idea: require("../models").idea,
    User: require("../models").user,
    Category: require("../models").category,
    Stage: require("../models").stage,
    Vote: require("../models").vote,
    Comment: require("../models").comment
};
describe('Idea',function(){
    var Idea = require("../models").idea;

    before(function(){
        return sequelize_fixtures.loadFiles(['./test/fixtures/stages.json',
                                              './test/fixtures/categories.json',
                                              './test/fixtures/users.json'], models).then(function(){
            return sequelize_fixtures.loadFile('./test/fixtures/ideas.json', models).then(function(){
                return sequelize_fixtures.loadFiles(['./test/fixtures/votes.json', './test/fixtures/comments.json'], models);
            });
        });
    });

    after(function() {
        models.Comment.destroy({where: {}});
        models.Vote.destroy({where: {}});
        Idea.destroy({where: {}});
        models.User.destroy({where: {}});
        models.Stage.destroy({where: {}});
        models.Category.destroy({where: {}});
    });

    //Test GET all ideas
    it('should list ALL ideas on /ideas GET', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            expect(res.body.length).to.be.above(2);
            expect(res.body[0].title).to.not.equal(null);
            done();
        });
    });

    //Test GET all ideas in a particular stage
    it('should list ideas in stage=1 on GET /ideas?stage=1', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            var lengthAll = res.body.length;
            request.get('/ideas?stage=1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err2, res2){
                if(err2) return done(err2);
                var lengthOneStage = res2.body.length;
                expect(lengthOneStage).to.be.below(lengthAll);
                done();
            });
        });
    });

    //Test GET all ideas created by a particular user
    it('should list ideas created by user=1 on GET /ideas?user=1', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            var lengthAll = res.body.length;
            request.get('/ideas?user=1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err2, res2){
                if(err2) return done(err2);
                var lengthForUser = res2.body.length;
                expect(lengthForUser).to.be.below(lengthAll);
                done();
            });
        });
    });

    //Test GET all ideas in a particular category
    it('should list ideas with category=1 on GET /ideas?category=1', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            var lengthAll = res.body.length;
            request.get('/ideas?category=1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err2, res2){
                if(err2) return done(err2);
                var lengthForCategory = res2.body.length;
                expect(lengthForCategory).to.be.below(lengthAll);
                done();
            });
        });
    });

    //Test getting votes if votes=true
    it('should return votes with the idea if /ideas?votes=true', function(done){
        request.get('/ideas?votes=true')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body[0]).to.have.property('votes');
            done();
        });
    });

    //Don't get votes if  votes=true is not in the query string
    it('should NOT return votes with the idea if votes=true is not in the query string', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body[0]).not.to.have.property('votes');
            done();
        });

    });

    //Don't get votes if votes=false is in the query string
    it('should NOT return votes with the idea if votes=false is in the query string', function(done){
        request.get('/ideas?votes=false')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body[0]).not.to.have.property('votes');
            done();
        });
    });

    //Test getting comments if comments=true
    it('should return comments with the idea if /ideas?comments=true', function(done){
        request.get('/ideas?comments=true')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body[0]).to.have.property('comments');
            done();
        });
    });

    //Don't get comments if  comments=true is not in the query string
    it('should NOT return comments with the idea if comments=true is not in the query string', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body[0]).not.to.have.property('comments');
            done();
        });

    });

    //Don't get comments if comments=false is in the query string
    it('should NOT return comments with the idea if comments=false is in the query string', function(done){
        request.get('/ideas?comments=false')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            expect(res.body[0]).not.to.have.property('comments');
            done();
        });
    });


    //Test create idea (POST)
    it('should add a SINGLE idea on /ideas POST', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .end(function(err, res){
            if(err) return done(err);
            var startIdeas = res.body.length;
            request.post('/ideas')
            .set('Accept', 'application/json')
            .send({'title':'Posted Idea', 'text': 'An idea from a POST request', 'views': 0, 'creator': 2, 'stage': 2, 'category': [1,2]})
            .expect(201)
            .end(function(postErr,postRes){
                if(postErr) return done(postErr);
                request.get('/ideas')
                .set('Accept', 'application/json')
                .end(function(err2, res2){
                    if(err2) return done(err2);
                    var endIdeas = res2.body.length;
                    expect(endIdeas).to.equal(startIdeas + 1);
                    done();
                });
            });
        });
    });

    //Test GET one specific idea
    it('should list a SINGLE idea on /ideas/<id> GET', function(done){
        Idea.create({title: 'Signup Feature', text: 'I have a new idea for Signup', views: 0, creator: 1, stage_id: 1})
        .then(function(idea){
            idea.addCategories([1,3]).then(function(cat){
                request.get('/ideas/' + idea.id)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function(err,res){
                    if(err) return done(err);
                    expect(res.body.title).to.equal("Signup Feature");
                    done();
                });
            });
            
        });
    });

    //Test GET non-existent idea
    it('should not be able to get a non-existent idea', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.get('/ideas/random')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
    });

    //Test update an idea (PUT) 
    it('should update a SINGLE idea on /ideas/<id> PUT',function(done){
        Idea.create({title: 'A New Feature', text: 'Here is a description of my idea', views: 0, creator: 1, stage_id: 1})
        .then(function(idea){
            idea.addCategories([2]).then(function(cat){
                request.put('/ideas/' + idea.id)
                .send({'views': 2, 'text': 'This is the best idea ever.', 'category': [1,3]})
                .set('Accept', 'application/json')
                .expect(200)
                .end(function(err,res){
                    if(err) return done(err);
                    expect(res.body.text).to.equal("This is the best idea ever.");
                    done();
                });
            });
        });
    });

    //Test update non-existent idea
    it('should not be able to update a non-existent idea', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.put('/ideas/random')
            .send({'views': 2, 'text': 'This is the best idea ever.'})
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        }); 
    });

    //Test DELETE an idea
    it('should delete a SINGLE idea on /ideas/<id> DELETE', function(done){
        Idea.create({title: 'Signup Feature', text: 'I have a new idea for Signup', views: 0, creator: 1, stage_id: 1,category_id: 1})
        .then(function(idea){
            request.delete('/ideas/' + idea.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                request.get('/ideas/' + idea.id)
                .set('Accept', 'application/json')
                .expect(404)
                .end(function(getErr,getRes){
                    if(getErr) return done(getErr);
                    done();
                });
            });
        });
    });

    //Test delete non-existent idea
    it('should not be able to delete a non-existent idea', function(done){
        request.get('/ideas')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.delete('/ideas/random')
        .expect(404)
        .end(function(err2,res2){
            if(err2) return done(err2);
                done();
            });
        });
    });
});

describe('Idea and Files', function(){
    it('should return all files for an idea');
});
