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
    Vote: require("../models").vote
};

//should the client be sending user and idea or user_id and idea_id?

describe('Vote',function(){
    var Vote = models.Vote;
    before(function(){
        return sequelize_fixtures.loadFiles(['./test/fixtures/stages.json',
                                              './test/fixtures/categories.json',
                                              './test/fixtures/users.json'], models).then(function(){
            return sequelize_fixtures.loadFile('./test/fixtures/ideas.json', models).then(function(){
                return sequelize_fixtures.loadFile('./test/fixtures/votes.json', models);
            });
        });
    });

    after(function() {
        models.Vote.destroy({where: {}});
        models.Idea.destroy({where: {}});
        models.User.destroy({where: {}});
        models.Stage.destroy({where: {}});
        models.Category.destroy({where: {}});
    });

    it('should list ALL votes on /votes GET', function(done){
        request.get('/votes')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            expect(res.body.length).to.be.above(2);
            expect(res.body[0].score).to.not.equal(null);
            done();
        });
    });

    //Test GET all votes for a particular idea
    it('should list votes for idea=1 on GET /votes?idea=1', function(done){
        request.get('/votes')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            var lengthAll = res.body.length;
            request.get('/votes?idea=1')
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

    //Test GET all votes for a particular user
    it('should list votes for user=1 on GET /votes?user=1', function(done){
        request.get('/votes')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            var lengthAll = res.body.length;
            request.get('/votes?user=1')
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err2, res2){
                if(err2) return done(err2);
                var lengthOneUser = res2.body.length;
                expect(lengthOneUser).to.be.below(lengthAll);
                done();
            });
        });
    });

    //Get a particular user's vote for a particular idea
    it("should get user1's vote for idea1", function(done){
        request.get('/votes?user=1&idea=1')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            expect(res.body.length).to.equal(1);
            done();
        });
    });

    //Test create vote (POST)
    it('should add one vote on /votes POST', function(done){
        request.get('/votes')
        .set('Accept', 'application/json')
        .end(function(err, res){
            if(err) return done(err);
            var startVotes = res.body.length;
            request.post('/votes')
            .set('Accept', 'application/json')
            .send({score: 3, idea_id: 1, user_id: 4})
            .expect(201)
            .end(function(postErr,postRes){
                if(postErr) return done(postErr);
                request.get('/votes')
                .set('Accept', 'application/json')
                .end(function(err2, res2){
                    if(err2) return done(err2);
                    var endVotes = res2.body.length;
                    expect(endVotes).to.equal(startVotes + 1);
                    done();
                });
            });
        });
    });

    //a user can only vote once for an idea.  They can update that vote, but only create once.
    it('should not allow one user to vote for an idea twice', function(done){
        Vote.create({score: 1, user_id: 4, idea_id: 3})
        .then(function(vote){
            request.post('/votes')
            .set('Accept', 'application/json')
            .send({'score': -8, 'idea_id': 3, 'user_id': 4})
            .expect(200)
            .end(function(err, res){
                if(err) return done(err);
                request.get('/votes/' + vote.id)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function(err2, res2){
                    if(err2) return done(err2);
                    expect(res2.body.score).to.equal(-8);
                });
                done();
            });
        });
    });

    //Test GET one specific vote
    it('should list a SINGLE vote on /vote/<id> GET', function(done){
        Vote.create({score: 7, user_id: 2, idea_id: 2})
        .then(function(vote){
            request.get('/votes/' + vote.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.score).to.equal(7);
                done();
            });
        });
    });

    //Test GET non-existent vote
    it('should not be able to get a non-existent vote', function(done){
        request.get('/votes')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.get('/votes/random')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
    });

    //Test update a vote (PUT) 
    it('should update one vote on /votes/<id> PUT',function(done){
        Vote.create({score: 5, user_id: 3, idea_id: 3})
        .then(function(vote){
            request.put('/votes/' + vote.id)
            .send({'score': -1})
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.score).to.equal(-1);
                done();
            });
           
        });
    });

    //Test update non-existent vote
    it('should not be able to update a non-existent vote', function(done){
        request.get('/votes')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.put('/votes/random')
            .send({'score': 1})
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        }); 
    });

    //Test DELETE a vote
    it('should delete a SINGLE vote on /votes/<id> DELETE', function(done){
        Vote.create({score: 9, user_id: 1, idea_id: 3})
            .then(function(vote){
            request.delete('/votes/' + vote.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                request.get('/votes/' + vote.id)
                .set('Accept', 'application/json')
                .expect(404)
                .end(function(getErr,getRes){
                    if(getErr) return done(getErr);
                    done();
                });
            });
        });
    });

    //Test delete non-existent vote
    it('should not be able to delete a non-existent vote', function(done){
        request.get('/votes')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.delete('/votes/random')
        .expect(404)
        .end(function(err2,res2){
            if(err2) return done(err2);
                done();
            });
        });
    });

});