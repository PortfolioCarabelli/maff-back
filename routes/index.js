// routes/index.js
const express = require('express');
const router = express.Router();
const protectedRoute = require('./protectedRoute');

// Importa tus rutas protegidas
router.use('/protected', protectedRoute);

module.exports = router;
