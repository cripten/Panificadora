var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var materieprime_schema = new Schema({
  nombre: {type:String, required:true},
  presentacion: {type:Number, required:true},
  creator: {type: Schema.Types.ObjectId, ref: "User"}
});

module.exports = mongoose.model("MateriePrime",materieprime_schema);
