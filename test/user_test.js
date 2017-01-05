var expect = require('chai').expect;
var myapp = require('../server.js');
var request = require('supertest')(myapp);
var sequelize_fixtures = require('sequelize-fixtures');
var models = {
    User: require("../models").user
};

describe('User',function(){
    var User = require("../models").user;
    
    before(function(){
        return sequelize_fixtures.loadFile('./test/fixtures/users.json', models);
    });

    after(function() {
        User.destroy({where: {}});
    });

    //Test GET all users
    it('should list ALL users on /users GET', function(done){
        request.get('/users')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            expect(res.body.length).to.be.above(2);
            expect(res.body[0].name).to.not.equal(null);
            done();
        });
    });

    //Test create user (POST)
    it('should add a SINGLE user on /users POST', function(done){
        request.get('/users')
        .set('Accept', 'application/json')
        .end(function(err, res){
            if(err) return done(err);
            var startUsers = res.body.length;
            request.post('/users')
            .set('Accept', 'application/json')
            .send({firstname: 'Donald', lastname: 'Trump', netid: 'dt1234', affiliation: 'staff', admin: '0',  commentMod: '0',  ideaMod: '1'})
            .expect(201)
            .end(function(postErr,postRes){
                if(postErr) return done(postErr);
                request.get('/users')
                .set('Accept', 'application/json')
                .end(function(err2, res2){
                    if(err2) return done(err2);
                    var endUsers = res2.body.length;
                    expect(endUsers).to.equal(startUsers + 1);
                    done();
                });
            });
        });
    });

    //Test GET one specific user
    it('should list a SINGLE user on /users/<id> GET', function(done){
        User.create({firstname: 'Donald', lastname: 'Trump', netid: 'dt1234', affiliation: 'staff', admin: '0',  commentMod: '0',  ideaMod: '1'})
        .then(function(user){
            request.get('/users/' + user.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.firstname).to.equal("Donald");
                done();
            });
        });
    });

    //Test GET non-existent user
    it('should not be able to get a non-existent user', function(done){
        request.get('/users')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.get('/users/random')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
        
    });

    //Test update a user (PUT)
    it('should update a SINGLE user on /users/<id> PUT',function(done){
        User.create({firstname: 'Donald', lastname: 'Trump', netid: 'dt1234', affiliation: 'staff', admin: '0',  commentMod: '0',  ideaMod: '1'})
        .then(function(user){
            request.put('/users/' + user.id)
            .set('Accept', 'application/json')
            .send({'firstname': user.firstname,
                   'netid': 'dd54321',
                   'lastname':'Duck', 
                    'admin': user.admin,
                    'commentMod': user.commentMod,
                    'ideaMod': user.ideaMod})
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.lastname).to.equal("Duck");
                done();
            });
        });
    });

    //make sure I can send just last name.  it should leave everything else alone
    it('should update just one field if that is all that has changed',function(done){
        User.create({firstname: 'Donald', lastname: 'Trump', netid: 'dt1234', affiliation: 'staff', admin: '0',  commentMod: '0',  ideaMod: '1'})
        .then(function(user){
            request.put('/users/' + user.id)
            .set('Accept', 'application/json')
            .send({
                   'lastname':'Duck'})
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.lastname).to.equal("Duck");
                expect(res.body.firstname).to.equal("Donald");
                done();
            });
        });
    });

    it('should handle nonsense JSON nicely',function(done){
        User.create({firstname: 'Donald', lastname: 'Trump', netid: 'dt1234', affiliation: 'staff', admin: '0',  commentMod: '0',  ideaMod: '1'})
        .then(function(user){
            request.put('/users/' + user.id)
            .set('Accept', 'application/json')
            .send({
                   'tagline':'Make America Great Again'})
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.lastname).to.equal("Trump");
                expect(res.body.firstname).to.equal("Donald");
                done();
            });
        });
    });

    //Test update non-existent user
    it('should not be able to update a non-existent user', function(done){
        request.get('/users')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.put('/users/random')
            .set('Accept', 'application/json')
            .send({'firstname': 'Daisy',
                   'lastname':'Duck', 
                    'netid:': 'dd54321',
                    'admin': 1,
                    'commentMod': 1,
                    'ideaMod': 1})
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });   
    });

    //Test DELETE a user
    it('should delete a SINGLE user on /users/<id> DELETE', function(done){
        User.create({firstname: 'Donald', lastname: 'Trump', netid: 'dt1234', affiliation: 'staff', admin: '0',  commentMod: '0',  ideaMod: '1'})
        .then(function(user){
            request.delete('/users/' + user.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                request.get('/users/' + user.id)
                .set('Accept', 'application/json')
                .expect(200)
                .end(function(getErr,getRes){
                    expect(getRes.body.deleted).to.be.true;
                    if(getErr) return done(getErr);
                    done();
                });
            });
        });
    });

    //Test delete non-existent user
    it('should not be able to delete a non-existent user', function(done){
        request.get('/users')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.delete('/users/random')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
        
    });
});

describe('User and Votes', function(){
    it('should return all votes for a given user');
});
