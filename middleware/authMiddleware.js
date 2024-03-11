// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');
const config = require('../config');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    // Obtener el token del encabezado
    const token = req.header('x-auth-token');

    // Verificar si no hay token
    if (!token) {
        return res.status(401).json({ msg: 'No hay token, acceso denegado' });
    }

    try {
        // Verificar el token
        const decoded = jwt.verify(token, config.jwtSecret);

        // Añadir el usuario desde el token decodificado
        req.user = await User.findById(decoded.user.id).select('-password');

        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token no válido' });
    }
};

module.exports = authMiddleware;
