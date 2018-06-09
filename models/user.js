var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");

var Schema = mongoose.Schema;

var user_schema = new Schema({
  nombre: {type: String, required:true },
  apellido: {type: String, required:true },
  email: {type: String, required:true },
  edad: {type: Number},
  genero: {type: String},
  username: {type: String, required:true },
  password: {type: String, required:true },
  tipo: {type: String, required:true },
  own: {type:String}

});

//methodo para encripta el pass
user_schema.methods.encryptPassword = function(password){
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
};
//comprueba que el pass si sea el correcto
user_schema.methods.validPassword = function(password){
	return bcrypt.compareSync(password, this.password);
};

module.exports = mongoose.model("User",user_schema);
