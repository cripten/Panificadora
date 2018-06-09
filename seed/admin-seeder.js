var User = require("../models/user");
var mongoose = require("mongoose");
var configDB = require("../config/database");

mongoose.connect(configDB.url);
var users = new User();
users.nombre = "SuperUsuario";
users.apellido = "Control Total";
users.email    = "johndevelopapp@gmail.com";
users.edad    =  24;
users.genero    = "hombre";
users.username = "admin";
users.password = users.encryptPassword("admin");//call to method encryptpassword of model and then save the pass encrypt in the model
users.tipo = "admin";
users.save(function(err,result){
	exit();
});

// se hizo esta funcion para desconectar el servidor debido a que el servidor trabaja de manera
//asyncrona entonces causaria un error  y no dejaria guardar  los usuarios
function exit(){
	mongoose.disconnect();
}
