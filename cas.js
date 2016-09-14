var cas = require('grand_master_cas'); 

cas.configure({
  casHost: process.env.CAS_HOST,
  casPath: process.env.CAS_PATH,
  ssl: true,                        
  service: process.env.CAS_SERVICE_URL,
  sessionName: "cas_user",          // the cas user_name will be at req.session.cas_user (this is the default)
  renew: false,                     // true or false, false is the default
  redirectUrl: '/'            // the route that cas.blocker will send to if not authed. Defaults to '/'
});

module.exports = cas;