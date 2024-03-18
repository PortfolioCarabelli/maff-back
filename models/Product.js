// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema({
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    precio: { type: Number, required: true },
    anioFabricacion: { type: Number, required: true },
    version: { type: String },
    color: { type: String },
    combustible: { type: String },
    puertas: { type: Number },
    transmision: { type: String },
    motor: { type: String },
    kilometros: { type: Number },
    tanque: { type: Number },
    abs: { type: Boolean },
    gnc: { type: Boolean },
    patente: { type: String, required: true },
    nombre: { type: String, required: true },
    imagenes: [{ type: String }],
    fechaCarga: { type: Date, default: Date.now } 
});

module.exports = mongoose.model('Product', ProductSchema);
