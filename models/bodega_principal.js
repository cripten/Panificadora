var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var bodega_principal_schema = new Schema({
  stock: {type: Number, required: true},
  cantidad: {type: Number, required: true},
  precio: {type: Number, required: true},
  mpid: {type: Schema.Types.ObjectId, ref: "MateriePrime"},
  creator: {type: Schema.Types.ObjectId, ref: "User"}

});

module.exports = mongoose.model("Bodega_Principal_schema",bodega_principal_schema);
