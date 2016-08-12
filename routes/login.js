var express = require('express');
var router = express.Router();
var models = require('../models');

//TODO: get actual student/faculty/staff value instead of making everyone students
//store this in the DB
router.route('/')
    .get(function(req, res, next) {
        var netid = req.session.cas_user;
        var jsonValue;
        models.user.findByNetId(netid).then(function(user){
            if(user){
                jsonValue = JSON.stringify({authenticated: true, 
                                id: user.id,
                                netid: user.netid, 
                                admin: user.admin, 
                                commentMod: user.commentMod, 
                                ideaMod: user.ideaMod,
                                designation: 'student'});
                res.cookie("user", jsonValue)
                res.redirect('/'); 
            }
            else{
                //TODO: use netid to get the user's first name, last name, and designation
                models.user.create({
                    firstname: 'New',
                    lastname: 'User',
                    netid: netid,
                    admin: 0,
                    commentMod: 0,
                    ideaMod: 0
                }).then(function(new_user){
                    user = new_user;
                    jsonValue = JSON.stringify({authenticated: true, 
                                id: user.id,
                                netid: user.netid, 
                                admin: user.admin, 
                                commentMod: user.commentMod, 
                                ideaMod: user.ideaMod,
                                designation: 'student'})
                    res.cookie("user", jsonValue)
                    res.redirect('/'); 
                });
            } 

        })
    })

module.exports = router;