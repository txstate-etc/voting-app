var expect = require('chai').expect;
var myapp = require('../app.js');
var request = require('supertest')(myapp);
var sequelize_fixtures = require('sequelize-fixtures');
var sequelize = require("../models").sequelize;
var models = {
    Reply: require("../models").reply,
    Comment: require("../models").comment,
    Idea: require("../models").idea,
    User: require("../models").user,
    Category: require("../models").category,
    Stage: require("../models").stage
};

describe('Reply',function(){
    var Reply = models.Reply;
    before(function(){
        return sequelize_fixtures.loadFiles(['./test/fixtures/stages.json',
                                              './test/fixtures/categories.json',
                                              './test/fixtures/users.json'], models).then(function(){
            return sequelize_fixtures.loadFile('./test/fixtures/ideas.json', models).then(function(){
                return sequelize_fixtures.loadFile('./test/fixtures/comments.json', models).then(function(){
                    return sequelize_fixtures.loadFile('./test/fixtures/replies.json', models);
                });
            });
        });
    });

    after(function() {
        models.Reply.destroy({where: {}});
        models.Comment.destroy({where: {}});
        models.Idea.destroy({where: {}});
        models.User.destroy({where: {}});
        models.Stage.destroy({where: {}});
        models.Category.destroy({where: {}});
    });

    //Test GET all replies
    it('should list ALL replies on /replies GET', function(done){
        request.get('/replies')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            expect(res.body.length).to.be.above(0);
            expect(res.body[0].text).to.not.equal(null);
            done();
        });
    });


    //Test GET all replies for a particular comment
    it('should list replies for comment=1 on GET /reply?comment=1', function(done){
        request.get('/replies')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            var lengthAll = res.body.length;
            request.get('/replies?comment=1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err2, res2){
                if(err2) return done(err2);
                var lengthOneComment = res2.body.length;
                expect(lengthOneComment).to.be.below(lengthAll);
                done();
            });
        });
    });

    //Test create reply (POST)
    it('should add a SINGLE reply on /replies POST', function(done){
        request.get('/replies')
        .set('Accept', 'application/json')
        .end(function(err, res){
            if(err) return done(err);
            var startReplies = res.body.length;
            request.post('/replies')
            .set('Accept', 'application/json')
            .send({'text': 'Desk goes up, desk goes down.', 'approved': 0, 'user_id': 1, 'comment_id': 2})
            .expect(201)
            .end(function(postErr,postRes){
                if(postErr) return done(postErr);
                request.get('/replies')
                .set('Accept', 'application/json')
                .end(function(err2, res2){
                    if(err2) return done(err2);
                    var endReplies = res2.body.length;
                    expect(endReplies).to.equal(startReplies + 1);
                    done();
                });
            });
        });
    });

    //Test GET one specific reply
    it('should list a SINGLE reply on /replies/<id> GET', function(done){
        Reply.create({text: 'More cowbell', approved: 0, user_id: 3, comment_id: 3})
        .then(function(reply){
            request.get('/replies/' + reply.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.text).to.equal("More cowbell");
                done();
            });
        });
    });

    //Test GET non-existent reply
    it('should not be able to get a non-existent reply', function(done){
        request.get('/replies')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.get('/replies/random')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
    });

    //Test update a reply (PUT)
    it('should update a SINGLE reply on /replies/<id> PUT',function(done){
        Reply.create({text: 'ABCDEFGHIJKLM', approved: 0, user_id: 3, comment_id: 2})
        .then(function(reply){
            request.put('/replies/' + reply.id)
            .send({'approved': 1})
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.approved).to.be.ok;  
                done();
            });
        });
    });

    //Test update non-existent reply
    it('should not be able to update a non-existent reply', function(done){
        request.get('/replies')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.put('/replies/random')
            .send({'approved':1})
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });   
    });

    //Test DELETE a reply
    it('should delete a SINGLE reply on /replies/<id> DELETE', function(done){
        Reply.create({text: 'Replying with something unrelated', approved: 0, user_id: 1, comment_id: 4})
        .then(function(reply){
            request.delete('/replies/' + reply.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                request.get('/replies/' + reply.id)
                .set('Accept', 'application/json')
                .expect(404)
                .end(function(getErr,getRes){
                    if(getErr) return done(getErr);
                    done();
                });
            });
        });
    });

    //Test delete non-existent reply
    it('should not be able to delete a non-existent reply', function(done){
        request.get('/replies')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.delete('/replies/random')
        .expect(404)
        .end(function(err2,res2){
            if(err2) return done(err2);
                done();
            });
        });
    });
});