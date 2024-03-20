// controllers/productController.js
const Product = require('../models/Product');
const multer = require('multer');
// Configurar multer para almacenar las imágenes en disco
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, 'uploads/'); // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
      cb(null, file.originalname);
  }
});
// Middleware de multer para procesar las imágenes en las solicitudes
const upload = multer({ storage: storage });

exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

exports.createProduct = async (req, res) => {
  try {
    console.log(req.body)
    const product = new Product(req.body);
    await product.save();
    res.json({ msg: 'Producto creado exitosamente', product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(req.body)
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json({ msg: 'Producto actualizado exitosamente', product });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ msg: 'Producto no encontrado' });
    }
    res.json({ msg: 'Producto eliminado exitosamente' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Error del servidor');
  }
};
