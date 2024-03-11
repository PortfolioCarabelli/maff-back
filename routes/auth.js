// routes/auth.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Rutas de autenticación
router.post('/login', authController.login);
router.post('/register', authController.register);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword); 
router.get('/users', authController.getAllUsers);
router.post('/user', authController.createUser); 
router.put('/user/:id', authController.updateUser); 
router.delete('/user/:id', authController.deleteUser); 
module.exports = router;
