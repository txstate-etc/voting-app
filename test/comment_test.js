var expect = require('chai').expect;
var myapp = require('../app.js');
var request = require('supertest')(myapp);
var sequelize_fixtures = require('sequelize-fixtures');
var sequelize = require("../models").sequelize;
var models = {
    Comment: require("../models").comment,
    Idea: require("../models").idea,
    User: require("../models").user,
    Category: require("../models").category,
    Stage: require("../models").stage
};

describe('Comment',function(){
    var Comment = models.Comment;
    before(function(){
        return sequelize_fixtures.loadFiles(['./test/fixtures/stages.json',
                                              './test/fixtures/categories.json',
                                              './test/fixtures/users.json'], models).then(function(){
            return sequelize_fixtures.loadFile('./test/fixtures/ideas.json', models).then(function(){
                return sequelize_fixtures.loadFile('./test/fixtures/comments.json', models);
            });
        });
    });

    after(function() {
        models.Comment.destroy({where: {}});
        models.Idea.destroy({where: {}});
        models.User.destroy({where: {}});
        models.Stage.destroy({where: {}});
        models.Category.destroy({where: {}});
    });

    //Test GET all comments
    it('should list ALL comments on /comments GET', function(done){
        request.get('/comments')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            expect(res.body.length).to.be.above(0);
            expect(res.body[0].text).to.not.equal(null);
            done();
        });
    });


    //Test GET all comments for a particular idea
    it('should list comments for idea=1 on GET /comments?idea=1', function(done){
        request.get('/comments')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            var lengthAll = res.body.length;
            request.get('/comments?idea=1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err2, res2){
                if(err2) return done(err2);
                var lengthOneIdea = res2.body.length;
                expect(lengthOneIdea).to.be.below(lengthAll);
                done();
            });
        });
    });

    //Test GET all comments created by a particular user
    it('should list comments created by user=1 on GET /comments?user=1', function(done){
        request.get('/comments')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            var lengthAll = res.body.length;
            request.get('/comments?user=1')
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

    //Test create comment (POST)
    it('should add a SINGLE comment on /comments POST', function(done){
        request.get('/comments')
        .set('Accept', 'application/json')
        .end(function(err, res){
            if(err) return done(err);
            var startComments = res.body.length;
            request.post('/comments')
            .set('Accept', 'application/json')
            .send({'text': 'Let\'s go get ice cream.', 'approved': 0, 'user_id': 2, 'idea_id': 2})
            .expect(201)
            .end(function(postErr,postRes){
                if(postErr) return done(postErr);
                request.get('/comments')
                .set('Accept', 'application/json')
                .end(function(err2, res2){
                    if(err2) return done(err2);
                    var endComments = res2.body.length;
                    expect(endComments).to.equal(startComments + 1);
                    done();
                });
            });
        });
    });

    //Test GET one specific comment
    it('should list a SINGLE comment on /comments/<id> GET', function(done){
        Comment.create({text: 'ABCDEFGHIJKLM', approved: 0, user_id: 3, idea_id: 3})
        .then(function(comment){
            request.get('/comments/' + comment.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.text).to.equal("ABCDEFGHIJKLM");
                done();
            });
        });
    });

    //Test GET non-existent comment
    it('should not be able to get a non-existent comment', function(done){
        request.get('/comments')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.get('/comments/random')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
    });

    //Test update a comment (PUT)
    it('should update a SINGLE comment on /comments/<id> PUT',function(done){
        Comment.create({text: 'ABCDEFGHIJKLM', approved: 0, user_id: 3, idea_id: 3})
        .then(function(comment){
            request.put('/comments/' + comment.id)
            .send({'approved': 1})
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.approved).to.be.ok; //checks if approved is truthy.  
                done();
            });
        });
    });

    //Test update non-existent comment
    it('should not be able to update a non-existent comment', function(done){
        request.get('/comments')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.put('/comments/random')
            .send({'approved':1})
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });   
    });

    //Test DELETE a comment
    it('should delete a SINGLE comment on /comments/<id> DELETE', function(done){
        Comment.create({text: 'ABCDEFGHIJKLM', approved: 0, user_id: 3, idea_id: 3})
        .then(function(comment){
            request.delete('/comments/' + comment.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                request.get('/comments/' + comment.id)
                .set('Accept', 'application/json')
                .expect(404)
                .end(function(getErr,getRes){
                    if(getErr) return done(getErr);
                    done();
                });
            });
        });
    });

    //Test delete non-existent comment
    it('should not be able to delete a non-existent comment', function(done){
        request.get('/comments')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.delete('/comments/random')
        .expect(404)
        .end(function(err2,res2){
            if(err2) return done(err2);
                done();
            });
        });
    });
});