var User = require("../models/user");

module.exports = function(req,res,next){
  User.findById(req.params.id,function(err,user){
      if(user != null){
        //permite que este disponible en todas las vistas
        res.locals.user = user;
        next();
      }
      else{
        console.log("problemas");
        res.redirect("/app/staff");
      }
  });
}
