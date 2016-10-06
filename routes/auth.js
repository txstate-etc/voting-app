var auth = {

    authenticate: function(req, res, next){
        if(req.session.user_id){
            next();
        }
        else{
            res.format({
                    'text/html': function(){
                        res.redirect('/login');
                    },
                    'application/json': function(){
                        res.status(302).json({message: "Login required"});
                    }
                });
        }
        
    },

    admin: function(req, res, next){
        if(req.session.admin){
            next();
        }
        else{
            res.status(403).end();
        }
    }
}

module.exports = auth;