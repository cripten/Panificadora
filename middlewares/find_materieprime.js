var MateriePrime = require("../models/materieprime");

module.exports = function(req,res,next){
  MateriePrime.findById(req.params.id)
    .populate("creator")
    .exec(function(err,materieprime){
      if(materieprime != null){
        //permite que este disponible en todas las vistas
        res.locals.materieprime = materieprime;
        next();
      }
      else{
        console.log("problemas");
        res.redirect("/app/materieprime");
      }
  });
}
