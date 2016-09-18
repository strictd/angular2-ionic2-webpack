'use strict'

module.exports = function (app) {

  let async = require('async'),
  _q = require('q'),
  moment = require('moment'),
  passwd = require('./crypto-pbkdf2'),
  jwt = require('jsonwebtoken'),
  url = require('url');

  //_personnel = require('../personnel/personnel.model')(app),
  //_permission = require('../permission/permission.model')(app)
;


  // Authenticate Against to create session auth
  app.post('/sessions/create', function(req, res) {

    var userScheme = getUserScheme(req);

    if (!userScheme.username || !req.body.password) {
      return res.status(400).send("You must send the username and the password");
    }

    isBlocked(app.locals.ip).then(
      () => attemptLogin(req, res),
      (err) => {
        if (err === 'block') {
          res.status(400).send("Your IP is currently blocked");
        } else {
          res.status(500).send(`Server Error! ${err}`);
        }
      }
    );

  });


  // Signs Token with user data and expiration date
  function createToken(user, expires) {
    return jwt.sign(user, process.env.cookie_secret, { expiresIn: expires });
  }


  // Parses user information out of form submit
  function getUserScheme(req) {

    var username;
    var type;
    var remember = false;
    var userSearch = {};

    // The POST contains a username and not an email
    if(req.body.username) {
      username = req.body.username;
      type = 'username';
      userSearch = { username: username };
    }
    // The POST contains an email and not an username
    else if(req.body.email) {
      username = req.body.email;
      type = 'email';
      userSearch = { email: username };
    }

    if (req.body.remember) {
      remember = !!req.body.remember;
    }

    return {
      username: username,
      type: type,
      userSearch: userSearch,
      remember: remember
    }
  }


  // fetch IP based off header or connection data
  function getIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }

  // Check if ip address has attempted to many times in process.env.attempts_before_ban
  function isBlocked(ip) {
    var q = _q.defer();

    if (process.env.logFailedAttempts === 'true') {
      let db = app.locals.db.get('attempts');

      db.knex(`${db.db_ref}.attempts`).where({'ip': ip})
      .then(function (rows) {
        if (rows.length < parseInt(process.env.attempts_before_verify)) {
          q.resolve('allow');
        } else if (rows.length < parseInt(process.env.attempts_before_ban)) {
          q.resolve('verify');
        } else {
          console.log('BLOCKING: '+ ip);
          q.reject('block');
        }
      })
      .catch(function (error) { q.reject(error); });

      return q.promise;
    } else {
      return Promise.resolve('allow');
    }

  }


  function parseConfigDuration(timeString) {
    if (!timeString) { return 0; }

    var parsed;
    try { parsed = /([\+-])([\d]+) ([\w]+)$/gi.exec(timeString); } catch(e) { }
    if (parsed.length !== 4) { return 0; }

    var multiply = 0;
    var duration = 0;

    try { var interval = parsed[3].toLowerCase(); } catch(e) { return 0; }
    if (interval === 'minutes' || interval === 'minute' || interval === 'min' || interval === 'm') {multiply = 60;
    } else if (interval === 'hours' || interval === 'hour' || interval === 'hr' || interval === 'h') { multiply = 60 * 60;
    } else if (interval === 'days' || interval === 'day' || interval === 'd') { multiply = 60 * 60 * 24;
    } else if (interval === 'weeks' || interval === 'week' || interval === 'w') { multiply = 60 * 60 * 24 * 7; }

    try { duration = parseInt(parsed[2]); } catch(e) { return 0; }

    if (parsed[1] === '-') {
      return -duration * multiply;
    } else { return duration * multiply; }
  }

  function preparePersonnelTokenResponse(personnel, remember) {
    var expires = parseConfigDuration(process.env.cookie_forget);

    // Compile Personnel Token Information
    let token = {
      id: personnel.id,
      name: `${personnel.first} ${personnel.last}`,
      store: app.locals.store,
      location: personnel.location,
      permission: personnel.permissions
    }

    if(remember === true) {
      expires = parseConfigDuration(process.env.cookie_remember);
    }

    return createToken(token, expires);
  }




  // attempts to login user based on posted information
  // Checks Submitted information against database
  function attemptLogin(req, res) {

    let userScheme = getUserScheme(req);
    let component_ids = req.body.component_ids || '1';

    async.waterfall([
      // Find Personnel Records
      // Fetch Personnel Module
      // _cb => _personnel.fetchPersonnelQuery({username: userScheme.username}, [app.locals.store], ['id', 'first', 'last', 'location', 'password']).then(function(personnel) {
      //   if (!personnel.length) _cb(true, false);
      //   _cb(null, personnel[0]);
      // }).catch((err) => _cb(err, false)),
      // Default
      _cb => { 
        if (userScheme.username.toLowerCase() === 'admin') {
          _cb(null, {'password': 'admin'} );
        } else { _cb(null, false); }
      },


      // Compare Personnel Record
      // Compare encrypted password
      // (personnel, _cb) => { passwd.verifyPassword(req.body.password, personnel['password'], function(err, results) { _cb(err, results, personnel); }) },
      // Plain Password
      (personnel, _cb) => { if (req.body.password === personnel['password']) { _cb(null, true, personnel); } else { _cb(null, false, personnel); } },

      (results, personnel, _cb) => {
        let roleTable = 'personnel_roles';
        let roleColumn = 'personnel_id';
        let rolePerson = personnel.id;
        let roleQuery = {'component_ids': component_ids};

        // _permission.personnelComponents(roleTable, roleColumn, rolePerson, roleQuery).subscribe(resp => {
        //   personnel.permissions = resp;
          _cb(null, results, personnel)
        // }, err => {
        //   _cb(err, results, personnel)
        // });
      }

    ], function(err, results, personnel) {

      // console.log('Error: ', err);
      // console.log('Result: ', results);
      // console.log('Personnel: ', personnel);

      if (!err && !!results) {
        var uid = personnel.id;
        var idToken = preparePersonnelTokenResponse(personnel, userScheme.remember);

        res.status(201).send({ id_token: idToken });

      } else {
        res.status(401).send({message:"The username or password don't match"});
        if (process.env.logFailedAttempts === 'true') { failedAttempt(req, res); }
      }

    });

    res.status(201).send(origin);

  }



  // Logs Failed login attempts
  function failedAttempt(req, res) {
    let db = app.locals.db.get('attempts');

    let expireDate = moment().format('YYYY-MM-DD HH:mm:ss');
    let userScheme = getUserScheme(req);

    db.knex(`${db.db_ref}.attempts`).insert({username: userScheme.username, ip, expiredate: expireDate})
    .then(function (result) {  })
    .catch(function (error) { console.log('Error Adding Failed Attempt: ' + error, userScheme); });
  }



  // Deleting failed login attempts older than config.attack_mitigation_time
  function deleteAttempts(ip) {
    var q = _q.defer();

    if (process.env.logFailedAttempts === 'true') {
      let db = app.locals.db.get('attempts');

      var qb = db.knex(`${db.db_ref}.attempts`);

      if (arguments.length>1 && arguments[1] === 'all') {
        qb = qb.where('ip', ip);
      } else {
        var intervalSeconds = parseConfigDuration(process.env.attack_mitigation_time);
        qb = qb
          .where('ip', ip)
          .where(db.knex.raw(`date_add(expires, interval ${intervalSeconds} second)`), '<', moment().format('YYYY-MM-DD HH:mm:ss'));
      }

      qb
        .del()
        .then(function (result) { q.resolve(result); })
        .catch(function (error) { q.reject(error); });

      return q.promise;
    } else {
      return Promise.resolve('allow');
    }
  }
}
