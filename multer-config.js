const multer = require('multer');

// Configuración de Multer para manejar la carga de imágenes
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

module.exports = upload;
