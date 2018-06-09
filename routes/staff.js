var express = require('express');
var router = express.Router();
//var csrf = require("csurf");
var passport = require("passport");
var flash = require("connect-flash");
var cloudinary = require("cloudinary");
var User = require("../models/user");
var user_find_middleware = require("../middlewares/find_user");

cloudinary.config({
	cloud_name: "crictos",
	api_key: "648798357264591",
	api_secret: "tVpkvHfncVvLXa67eYuVG4T8YZU"
});

//SERVICE =========================
	// new staff form
router.get("/staff/new",function(req,res,next){
	res.render("app/staff/new.ejs",{ messages: req.flash("error"), tipo: req.session.userType == "admin" ? "owner" : "worker" });
});

//all routes with this path use this middleware for refactor code
router.all("/staff/:id*",user_find_middleware);
//-----------------------------------------------------

// edit staff form
router.get("/staff/:id/edit",function(req,res,next){
	res.render("app/staff/edit.ejs",{ messages: req.flash("error")});
});

//STAFF ACTIONS================
router.route("/staff/:id")
.get(function(req,res,next){
	res.render("app/staff/show.ejs")
})
.put(validStaff,function(req,res,next){
  res.locals.user.name = req.body.name;
  res.locals.user.apellido = req.body.apellido;
  res.locals.user.email = req.body.email;
  res.locals.user.password = res.locals.user.encryptPassword(req.body.password);// almacena la url de la imagen guarda en cloudinary y la almecena en el schema
  res.locals.user.save(function(err){
    if(!err){
      res.redirect("/app/staff");
    }
    else{
      console.log(err);
    }
  });
	//si es true subimos la imagen si no guardamos los datos sin imagenes
	/*if(req.files.hasOwnProperty("image_avatar")){
		//se utiliza esta linea para guardar las imagenes en cloudinary porque cuando el proyecto sea subido
		// a heroku los archivos se borran
		cloudinary.uploader.upload(req.files.image_avatar.path,
			function(result){
				res.locals.service.title = req.body.title;
				res.locals.service.description = req.body.description;
				res.locals.service.price = req.body.price;
				res.locals.service.imageUrl = result.url;// almacena la url de la imagen guarda en cloudinary y la almecena en el schema
				res.locals.service.save(function(err){
					if(!err){
						res.redirect("/app/service/"+res.locals.service._id);
					}
					else{
						console.log(err);
					}
				});
			}
		);

	}else{
		res.redirect("/app/staff");
	}*/
})
.delete(function(req,res,next){
	User.findOneAndRemove({_id:req.params.id},function(err){
		if(!err){
			res.redirect("/app/staff");

		}
		else{
			console.log(err);
			res.redirect("/app/staff"+req.params.id);
		}
	});
});

//STAFF COLLECTION ================
router.route("/staff")
.get(function(req,res,next){//show all services
	User.find({own:req.session.passport.user},function(err,user){
		if(err){ res.redirect("/"); return; }
		res.render("app/staff/index.ejs",{users:user});
	});
})
.post(validStaff,function(req,res,next){
  passport.authenticate("local-signup", {
    successRedirect: '/app/staff',
    failureRedirect: '/app/staff',
    failureFlash: true
  })(req,res,next);
});

module.exports = router;

function validStaff(req,res,next){
  //aqui se valida con express-validator
  req.checkBody('nombre','Invalid nombre').notEmpty().isLength({min:4})
  req.checkBody('apellido','Invalid apellido').notEmpty().isLength({min:4}).withMessage('The name is too short');
  req.checkBody('email','Invalid email').notEmpty().isEmail();
	if(!req.body.userid){
		req.checkBody('username','Invalid username').notEmpty().isLength({min:4});
	}
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
		if(req.body.userid){
			res.redirect("/app/staff/"+req.body.userid+"/edit");//devuelve la cadena de mensajes
		}else{
			res.redirect("/app/staff/new");//devuelve la cadena de mensajes
		}
  }
  else{
    return next();
  }
};
