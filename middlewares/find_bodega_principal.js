var Bodega_Principal = require("../models/bodega_principal");

module.exports = function(req,res,next){
  Bodega_Principal.findById(req.params.id)
    .populate("creator mpid")
    .exec(function(err,bodega_principal){
      if(bodega_principal != null){
        //permite que este disponible en todas las vistas
        res.locals.bodega_principal = bodega_principal;
        next();
      }
      else{
        console.log("problemas");
        res.redirect("/app/bodega_principal");
      }
  });
}
