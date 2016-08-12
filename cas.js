var cas = require('grand_master_cas'); 

cas.configure({
  casHost: "llavero.its.txstate.edu",   
  casPath: "/cas",                
  ssl: true,                        
  service: "http://localhost:3000/login", // your site
  sessionName: "cas_user",          // the cas user_name will be at req.session.cas_user (this is the default)
  renew: false,                     // true or false, false is the default
  redirectUrl: '/'            // the route that cas.blocker will send to if not authed. Defaults to '/'
});

module.exports = cas;