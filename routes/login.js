var express = require('express');
var router = express.Router();
var models = require('../models');
var https = require('https');
var cas = require('../cas');

var currentPage = "/";

function saveCurrentPage(req, res, next){
    if(req.query.url){
        currentPage = req.query.url;
    }
    next()
}

router.route('/')
    .get(saveCurrentPage, cas.bouncer, function(req, res, next) {
        var redirectPage = currentPage;
        currentPage = "/";
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
                                affiliation: user.affiliation});
                res.cookie("user", jsonValue)
                req.session['user_id'] = user.id;
                req.session['admin'] = user.admin;
                res.redirect(redirectPage); 
            }
            else{
                //get user's information from LDAP
                https.get("https://secure.its.txstate.edu/iphone/ldap/query.pl?netid=" + netid, (ldap_res) => {
                    ldap_res.setEncoding('UTF-8');
                    ldap_res.on('data', (d) => {
                        var JSONObject = JSON.parse(d);
                        models.user.create({
                            firstname: JSONObject.givenName,
                            lastname: JSONObject.sn,
                            netid: netid,
                            admin: 0, 
                            commentMod: 0,
                            ideaMod: 0,
                            affiliation: JSONObject.txstatePersonPrimaryAffiliation || 'student'
                        }).then(function(new_user){
                            user = new_user;
                            jsonValue = JSON.stringify({authenticated: true, 
                                id: user.id,
                                netid: user.netid, 
                                admin: user.admin, 
                                commentMod: user.commentMod, 
                                ideaMod: user.ideaMod,
                                affiliation: user.affiliation})
                            res.cookie("user", jsonValue);
                            req.session['user_id'] = user.id
                            res.redirect(redirectPage); 
                        })
                    });
                }).on('error', (e) => {
                  next(e);
                });
            } 

        })
    })

module.exports = router;