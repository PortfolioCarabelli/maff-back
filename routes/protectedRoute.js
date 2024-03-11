// routes/protectedRoute.js
const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');

// Ruta protegida
router.get('/', authMiddleware, (req, res) => {
    // Acceso permitido solo si el usuario está autenticado
    res.json({ msg: 'Acceso permitido' });
});

module.exports = router;
