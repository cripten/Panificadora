var express = require("express");
var router = express.Router();
var MateriePrime = require("../models/materieprime");
var Bodega_Principal = require("../models/bodega_principal");
var flash = require("connect-flash");
var bodega_principal_find_middleware = require("../middlewares/find_bodega_principal");
//MATERIEPRIME =========================
// new materieprime form
router.get("/bodega_principal/new",function(req,res,next){
  MateriePrime.find({},function(err,materieprime){
    if(err){ res.redirect("/"); return; }
    res.render("app/bodega_principal/new.ejs",{ messages: req.flash("error"), materieprime:materieprime });
  });
});
//all routes with this path use this middleware for refactor code
/*router.all("/bodega_principal/:id*",bodega_principal_find_middleware);
//-----------------------------------------------------
// edit materieprime form
router.get("/bodega_principal/:id/edit",function(req,res,next){
  res.render("app/bodega_principal/edit.ejs",{ messages: req.flash("error") });
});

router.route("/bodega_principal/:id")
.get(function(req,res,next){

})
.put(validMP,function(req,res,next){
  res.locals.bodega_principal.nombre = req.body.nombre;
  res.locals.bodega_principal.stock = req.body.cantidad * req.body.presentacion;
  res.locals.bodega_principal.cantidad = req.body.cantidad;
  res.locals.bodega_principal.precio = req.body.cantidad;
  res.locals.bodega_principal.save(function(err){
    if(!err){
			res.redirect("/app/bodega_principal");
		}
		else{
			console.log(err);
			res.redirect("/app/bodega_principal/"+req.params.id);
		}
  });
})
.delete(function(req,res,next){
  MateriePrime.findOneAndRemove({ _id:req.params.id},function(err){
    if(!err){
			res.redirect("/app/bodega_principal");
		}
		else{
			console.log(err);
			res.redirect("/app/bodega_principal/"+req.params.id);
		}
  });
});*/

//MATERIEPRIME COLLECTION ================
router.route("/bodega_principal")
.get(function(req,res,next){
  Bodega_Principal.find({"creator": req.session.passport.user})
  .populate("mpid")
  .exec(function(err,entradas){
    if(err){ res.redirect("/app"); return; }
    console.log(entradas.mpid);
		res.render("app/bodega_principal/index.ejs", { entradas:entradas });
  });
})
.post(validMP,function(req,res,next){
  var data = {
    stock: 0,
    cantidad: req.body.cantidad,
    precio: req.body.precio,
    creator: req.session.passport.user,
    mpid: req.body.mpid
  }
  var bodega_principal = new Bodega_Principal(data);
  bodega_principal.save(function(err){
    if(!err){
      res.redirect("/app/bodega_principal");
    }
    else{
      console.log(err);
    }
  });
});

module.exports = router;


function validMP(req,res,next){
		//aqui se valida con express-validator
		req.checkBody('cantidad','Invalid cantidad').notEmpty();
    req.checkBody('precio','Invalid precio').notEmpty();


		var errors = req.validationErrors(true);//almacena todos los errores
		if(errors){
			var messages = [];
			for(var type in errors){
				messages.push(errors[type].msg);
				console.log(errors[type].msg);
			}
			req.flash("error",messages);
			res.redirect("/app/bodega_principal/new");//devuelve la cadena de mensajes
		}
		else{
			return next();
		}
};
