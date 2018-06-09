var express = require('express');
var router = express.Router();
//var csrf = require("csurf");
var passport = require("passport");
var flash = require("connect-flash");

//AUTHENTICATE REDIRECT =====================
router.get("/home",function(req,res,next){
	req.session.userType = req.user.tipo;
	if(req.session.userType == "admin"){
		res.redirect("/app/service");
	}
	if(req.session.userType == "owner"){
		res.redirect("/app/staff");
	}
	else{
		res.redirect("/app/work");
	}
});
// PROFILE SECTION =========================
router.get("/profile",function(req,res,next){
	//console.log(req.session.oldUrl);
	req.session.userType = req.user.tipo;
	res.render("user/profile.ejs", { user:req.user });
});

// LOGOUT ==============================
router.get('/logout', function(req, res,next) {
	req.logout();
	res.redirect('/');
});
// locally --------------------------------
	// LOGIN ===============================
	// show the login form
	router.get('/login', function(req, res,next) {
		res.render('user/login.ejs', {/*csrfToken: req.csrfToken(),*/ messages: req.flash('error') });
	});


	// process the login form
	router.post('/login',validLogin,function(req,res,next){
		passport.authenticate('local-login', {
			successRedirect : '/user/profile', // redirect to the secure profile section
			failureRedirect : '/user/login', // redirect back to the signup page if there is an error
			failureFlash : true // allow flash messages
		})(req,res,next);
	});
	router.get("/signup",function(req,res,next){
		res.render("user/signup.ejs", {/*csrfToken: req.csrfToken(),*/ messages: req.flash("error") });
	});
	// process the Signup form
	router.post("/signup",validSignup,function(req,res,next){
		passport.authenticate("local-signup", {
			successRedirect: '/user/home',
			failureRedirect: '/user/signup',
			failureFlash: true
		})(req,res,next);
	});

	module.exports = router;

	function validLogin(req,res,next){
		req.checkBody('username','Invalid username').notEmpty();
		req.checkBody('password','Invalid password').notEmpty();
		var errors = req.validationErrors(true);//almacena todos los errores
   	console.log(errors);

		if(errors){
		/*	var messages = [];
			errors.forEach(function(error){// se recorre
				messages.push(error.msg);
			});*///esto sirve dado el caso que se quiera mostrar todos los mensajes quitando el true de validation errors
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
			res.redirect("/user/login");//devuelve la cadena de mensajes
		}
		else{
			return next();
		}
	};

	function validSignup(req,res,next){
		//aqui se valida con express-validator
		req.checkBody('nombre','Invalid nombre').notEmpty().isLength({min:4})
		req.checkBody('apellido','Invalid apellido').notEmpty().isLength({min:4}).withMessage('The name is too short');
		req.checkBody('email','Invalid email').notEmpty().isEmail();
		req.checkBody('edad','Invalid edad').notEmpty().isEmail();
		req.checkBody('genero','Invalid genero').notEmpty().isEmail();
		req.checkBody('username','Invalid username').notEmpty().isLength({min:4});
		req.checkBody('password','Invalid password').notEmpty().isLength({min:4});
		req.checkBody('passwordConfirm','Invalid password,it is not the same').notEmpty().isLength({min:4}).equals(req.body.password);


		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
			res.redirect("/user/signup");//devuelve la cadena de mensajes
		}
		else{
			return next();
		}
	};
