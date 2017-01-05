var expect = require('chai').expect;
var myapp = require('../server.js');
var request = require('supertest')(myapp);
var sequelize_fixtures = require('sequelize-fixtures');
var models = {
    Stage: require("../models").stage
};

describe('Stage',function(){
    var Stage = require("../models").stage;
    
    before(function(){
        Stage.destroy({where: {}});
        return sequelize_fixtures.loadFile('./test/fixtures/stages.json', models);
    });

    after(function() {
        Stage.destroy({where: {}});
    });

    //Test GET all stages
    it('should list ALL stages on /stages GET', function(done){
        request.get('/stages')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            expect(res.body.length).to.be.above(0);
            expect(res.body[0].name).to.not.equal(null);
            done();
        });
    });

    //Test create stage (POST)
    it('should add a SINGLE stage on /stages POST', function(done){
        request.get('/stages')
        .set('Accept', 'application/json')
        .end(function(err, res){
            if(err) return done(err);
            var startStages = res.body.length;
            request.post('/stages')
            .set('Accept','application/json')
            .send({'name':'Open'})
            .expect(201)
            .end(function(postErr,postRes){
                if(postErr) return done(postErr);
                request.get('/stages')
                .set('Accept', 'application/json')
                .end(function(err2, res2){
                    if(err2) return done(err2);
                    var endStages = res2.body.length;
                    expect(endStages).to.equal(startStages + 1);
                    done();
                });
            });
        });
    });

    //Test GET one specific stage
    it('should list a SINGLE stage on /stages/<id> GET', function(done){
        Stage.create({name: 'Archived'})
        .then(function(stage){
            request.get('/stages/' + stage.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.name).to.equal("Archived");
                done();
            });
        });
    });

    //Test GET non-existent stage
    it('should not be able to get a non-existent stage', function(done){
        request.get('/stages')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.get('/stages/random')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
        
    });

    //Test update a stage (PUT)
    it('should update a SINGLE stage on /stages/<id> PUT',function(done){
        Stage.create({name: 'Archived'})
        .then(function(stage){
            request.put('/stages/' + stage.id)
            .send({'name':'New'})
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.name).to.equal("New");
                done();
            });
        });
    });

    //Test update non-existent stage
    it('should not be able to update a non-existent stage', function(done){
        request.get('/stages')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.put('/stages/random')
            .send({'name':'New'})
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });   
    });

    //Test DELETE a stage
    it('should delete a SINGLE stage on /stages/<id> DELETE', function(done){
        Stage.create({name: 'Archived'})
        .then(function(stage){
            request.delete('/stages/' + stage.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                request.get('/stages/' + stage.id)
                .expect(404)
                .end(function(getErr,getRes){
                    if(getErr) return done(getErr);
                    done();
                });
            });
        });
    });

    //Test delete non-existent stage
    it('should not be able to delete a non-existent stage', function(done){
        request.get('/stages')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.delete('/stages/random')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
        
    });
});

describe('Stage and Ideas', function(){
    it('should return all ideas within a particular stage');
});