var expect = require('chai').expect;
var myapp = require('../app.js');
var request = require('supertest')(myapp);
var sequelize_fixtures = require('sequelize-fixtures');
var models = {
    Category: require("../models").category
};

describe('Category',function(){
    var Category = require("../models").category;
    
    before(function(){
        Category.destroy({where: {}});
        return sequelize_fixtures.loadFile('./test/fixtures/categories.json', models);
    });

    after(function() {
        Category.destroy({where: {}});
    });

    //Test GET all categories
    it('should list ALL categories on /categories GET', function(done){
        request.get('/categories')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err,res){
            if(err) return done(err);
            expect(res.body.length).to.be.above(0);
            expect(res.body[0].name).to.not.equal(null);
            done();
        });
    });

    //Test create category (POST)
    it('should add a SINGLE category on /categories POST', function(done){
        request.get('/categories')
        .set('Accept', 'application/json')
        .end(function(err, res){
            if(err) return done(err);
            var startCategories = res.body.length;
            request.post('/categories')
            .send({'name':'Voting Application'})
            .set('Accept','application/json')
            .expect(201)
            .end(function(postErr,postRes){
                if(postErr) return done(postErr);
                request.get('/categories')
                .set('Accept', 'application/json')
                .end(function(err2, res2){
                    if(err2) return done(err2);
                    var endCategories = res2.body.length;
                    expect(endCategories).to.equal(startCategories + 1);
                    done();
                });
            });
        });
    });

    //Test GET one specific category
    it('should list a SINGLE category on /categories/<id> GET', function(done){
        Category.create({name: 'New Application'})
        .then(function(category){
            request.get('/categories/' + category.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                console.log(res.body);
                if(err) return done(err);
                expect(res.body.name).to.equal("New Application");
                done();
            });
        });
    });

    //Test GET non-existent category
    it('should not be able to get a non-existent category', function(done){
        request.get('/categories')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.get('/categories/random')
            .set('Accept', 'application/json')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
        
    });

    //Test update a category (PUT)
    it('should update a SINGLE category on /categories/<id> PUT',function(done){
        Category.create({name: 'Imagehandler'})
        .then(function(category){
            request.put('/categories/' + category.id)
            .send({'name':'Image Handler'})
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                expect(res.body.name).to.equal("Image Handler");
                done();
            });
        });
    });

    //Test update non-existent category
    it('should not be able to update a non-existent category', function(done){
        request.get('/categories')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.put('/categories/random')
            .send({'name':'Image Handler'})
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });   
    });

    //Test DELETE a category
    it('should delete a SINGLE category on /categories/<id> DELETE', function(done){
        Category.create({name: 'Mobile App'})
        .then(function(category){
            request.delete('/categories/' + category.id)
            .set('Accept', 'application/json')
            .expect(200)
            .end(function(err,res){
                if(err) return done(err);
                request.get('/categories/' + category.id)
                .expect(404)
                .end(function(getErr,getRes){
                    if(getErr) return done(getErr);
                    done();
                });
            });
        });
    });

    //Test delete non-existent category
    it('should not be able to delete a non-existent category', function(done){
        request.get('/categories')
        .set('Accept', 'application/json')
        .expect(200)
        .end(function(err, res){
            if(err) return done(err);
            request.delete('/categories/random')
            .expect(404)
            .end(function(err2,res2){
                if(err2) return done(err2);
                done();
            });
        });
        
    });
});

//Move this test to idea_test
describe('Category and Ideas', function(){
    it('should return all ideas within a particular category');
});