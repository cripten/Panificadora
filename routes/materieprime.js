var express = require("express");
var router = express.Router();
var MateriePrime = require("../models/materieprime");
var flash = require("connect-flash");
var materieprime_find_middleware = require("../middlewares/find_materieprime");
//MATERIEPRIME =========================
// new materieprime form
router.get("/materieprime/new",function(req,res,next){
  res.render("app/materieprime/new.ejs",{ messages: req.flash("error") });
});
//all routes with this path use this middleware for refactor code
router.all("/materieprime/:id*",materieprime_find_middleware);
//-----------------------------------------------------
// edit materieprime form
router.get("/materieprime/:id/edit",function(req,res,next){
  res.render("app/materieprime/edit.ejs",{ messages: req.flash("error") });
});

router.route("/materieprime/:id")
.get(function(req,res,next){

})
.put(validMP,function(req,res,next){
  res.locals.materieprime.nombre = req.body.nombre;
  res.locals.materieprime.presentacion = req.body.presentacion;
  res.locals.materieprime.save(function(err){
    if(!err){
			res.redirect("/app/materieprime");
		}
		else{
			console.log(err);
			res.redirect("/app/materieprime/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  MateriePrime.findOneAndRemove({ _id:req.params.id},function(err){
    if(!err){
			res.redirect("/app/materieprime");
		}
		else{
			console.log(err);
			res.redirect("/app/materieprime/"+req.params.id);
		}
  });
});

//MATERIEPRIME COLLECTION ================
router.route("/materieprime")
.get(function(req,res,next){
  MateriePrime.find({creator:req.session.passport.user},function(err,materieprime){
    if(err){res.redirect("/"); return;}
    res.render("app/materieprime/index.ejs", { materieprime:materieprime });
  });
})
.post(validMP,function(req,res,next){
  var data = {
    nombre: req.body.nombre,
    presentacion: req.body.presentacion,
    creator: req.session.passport.user
  }
  var materieprime = new MateriePrime(data);
  materieprime.save(function(err){
    if(!err){
      res.redirect("/app/materieprime");
    }
    else{
      console.log(err);
    }
  });
});

module.exports = router;


function validMP(req,res,next){
		//aqui se valida con express-validator
		req.checkBody('nombre','Invalid invalid nombre').notEmpty().isLength({min:3})
		req.checkBody('presentacion','Invalid presentacion').notEmpty();


		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
			res.redirect("/app/materieprime/new");//devuelve la cadena de mensajes
		}
		else{
			return next();
		}
};
