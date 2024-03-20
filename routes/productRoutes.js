// routes/productRoutes.js
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const Product = require('../models/Product');
const upload = require('../config/upload');
const uploadFile = require('../util/uploadFile');

router.get('/', productController.getAllProducts);
router.post('/', upload.fields([{ name: 'image'}]), async (req, res) => {
    const body = req.body;
    const images = req.files.image;

    if (!images || images.length === 0) {
        return res.status(400).json({ message: "No se proporcionaron imágenes para el producto." });
    }

    const downloadURLs = [];
    for (const image of images) {
        const { downloadURL } = await uploadFile(image);
        downloadURLs.push(downloadURL);
    }
    console.log(downloadURLs)
    const newProduct = new Product({
        marca: body.marca,
        modelo: body.modelo,
        precio: body.precio,
        anioFabricacion: body.anioFabricacion,
        version: body.version,
        color: body.color,
        combustible: body.combustible,
        puertas: body.puertas,
        transmision: body.transmision,
        motor: body.motor,
        kilometros: body.kilometros,
        tanque: body.tanque,
        abs: body.abs,
        gnc: body.gnc,
        patente: body.patente,
        nombre: body.nombre,
        imagenes: downloadURLs   
    });

    try {
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ruta para actualizar un producto existente
router.put('/:id', upload.fields([{ name: 'image'}]), async (req, res) => {
    const productId = req.params.id;
    const body = req.body;
    const images = req.files.image;

    try {
        // Verificar si se proporcionaron imágenes
        if (images && images.length > 0) {
            const downloadURLs = [];
            for (const image of images) {
                const { downloadURL } = await uploadFile(image);
                downloadURLs.push(downloadURL);
            }
            body.imagenes = downloadURLs;
        }

        // Actualizar el producto en la base de datos
        const updatedProduct = await Product.findByIdAndUpdate(productId, body, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: "Producto no encontrado" });
        }

        // Enviar la respuesta con el producto actualizado
        res.status(200).json(updatedProduct);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.delete('/:id', productController.deleteProduct);

module.exports = router;
