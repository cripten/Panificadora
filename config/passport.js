// load all the things we need
var LocalStrategy    = require('passport-local').Strategy;

// load up the user model
//var User       = require('../app/models/user');
var User       = require('../models/user');


module.exports = function(passport) {

    // =========================================================================
    // passport session setup ==================================================
    // =========================================================================
    // required for persistent login sessions
    // passport needs ability to serialize and unserialize users out of session

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        User.findById(id, function(err, user) {
            done(err, user);
        });
    });

    // =========================================================================
    // LOCAL LOGIN =============================================================
    // ========================================================================
    passport.use('local-login', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req, username, password, done) {

        // asynchronous
        process.nextTick(function() {
            User.findOne({ 'username' :  username }, function(err, user) {
                // if there are any errors, return the error
                if (err)
                    return done(err);

                // if no user is found, return the message
                if (!user)
                    return done(null, false, req.flash('error', 'No user found.'));

                if (!user.validPassword(password))
                    return done(null, false, req.flash('error', 'Oops! Wrong password.'));

                // all is well, return user
                else
                    return done(null, user);
            });
        });

    }));

    // =========================================================================
    // LOCAL SIGNUP ============================================================
    // =========================================================================
    passport.use('local-signup', new LocalStrategy({
        // by default, local strategy uses username and password, we will override with email
        usernameField : 'username',
        passwordField : 'password',
        passReqToCallback : true // allows us to pass in the req from our route (lets us check if a user is logged in or not)
    },
    function(req,username,password,done)/*,nombre,apellido,email, username, password, tipo, done)*/ {
        // asynchronous
        process.nextTick(function() {
            //  Whether we're signing up or connecting an account, we'll need
            //  to know if the email address is in use.
            User.findOne({'username': username}, function(err, existingUser) {

                // if there are any errors, return the error
                if (err)
                    return done(err);

                // check to see if there's already a user with that email
                if (existingUser)
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                // create the user
                var newUser            = new User();
                newUser.nombre = req.body.nombre;
                newUser.apellido = req.body.apellido;
                newUser.email    = req.body.email;
                newUser.username = username;
                newUser.password = newUser.encryptPassword(password);//call to method encryptpassword of model and then save the pass encrypt in the model
                newUser.tipo = req.body.tipo;
                newUser.own = req.body.own;
                newUser.save(function(err) {
                    if (err)
                        throw err;
                    if(req.session.passport.user){
                      return done(null, false);
                    }else{
                      return done(null, newUser);
                    }
                });

              /*  //  If we're logged in, we're connecting a new local account.
                if(req.user) {
                    var user            = req.user;
                    user.local.email    = email;
                  //  user.local.password = user.generateHash(password);
                    user.local.password = user.encryptPassword(password);
                    user.save(function(err) {
                        if (err)
                            throw err;
                        return done(null, user);
                    });
                }
                //  We're not logged in, so we're creating a brand new user.
                else {
                    // create the user
                    var newUser            = new User();
                    newUser.nombre = nombre;
                    newUser.apellido = apellido;
                    newUser.email    = email;
                    newUser.username = username;
                    newUser.password = user.encryptPassword(password);//call to method encryptpassword of model and then save the pass encrypt in the model
                    newUser.tipo = "user";
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        return done(null, newUser);
                    });
                }*/

            });
        });

    }));

};
