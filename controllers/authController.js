// controllers/authController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const config = require('../config/config');
const sendRecoverEmail = require('../services/email.service');
const crypto = require('crypto');

const generateRecoverToken = () => {
    // Generar un token aleatorio utilizando crypto
    const token = crypto.randomBytes(20).toString('hex');
    return token;
};
// Función de registro
exports.register = async (req, res) => {
    try {
        const { email, password, first_name, last_name } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }
        user = new User({
            email,
            password,
            first_name,
            last_name
        });
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);
        await user.save();
        res.json({ msg: 'Usuario registrado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Credenciales inválidas' });
        }
        const fullName = user.first_name + ' ' + user.last_name; // Concatenar el nombre completo
        const payload = {
            user: {
                id: user.id
            }
        };
        jwt.sign(payload, config.jwtSecret, { expiresIn: 3600 }, (err, token) => {
            if (err) throw err;
            res.json({ token, fullName }); // Devolver el token y el nombre completo como respuesta
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

// Función para enviar correo electrónico de recuperación de contraseña
exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        console.log(req.body)
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ msg: 'El usuario no existe' });
        }

        // Generar un token de recuperación de contraseña (podrías usar JWT o alguna otra técnica)
        const recoverToken = generateRecoverToken(); // Implementa esta función según tu elección

        // Guardar el token de recuperación en la base de datos
        user.recoverToken = recoverToken;
        await user.save();

        // Enviar correo electrónico de recuperación de contraseña al usuario
        sendRecoverEmail(user.email, recoverToken); // Implementa esta función según tu elección

        res.json({ msg: 'Se ha enviado un correo electrónico con instrucciones para restablecer la contraseña' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};
// Función para restablecer la contraseña
exports.resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        console.log(req.body)
        const user = await User.findOne({ recoverToken: token });

        if (!user) {
            return res.status(404).json({ msg: 'Token inválido o expirado' });
        }

        // Actualizar la contraseña del usuario
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        user.recoverToken = null; // Eliminar el token de recuperación
        await user.save();

        res.json({ msg: 'Contraseña restablecida exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.createUser = async (req, res) => {
    try {
        first_name = req.body.email.first_name;
        last_name = req.body.email.last_name;
        email = req.body.email.email;
        password = req.body.email.password;
        let user = await User.findOne({ email });

        if (user) {
            return res.status(400).json({ msg: 'El usuario ya existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            first_name,
            last_name
        });

        await user.save();
        res.json({ msg: 'Usuario creado exitosamente', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;

        password = req.body.email.password;
        let user = await User.findById(id);
        console.log(user)
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        
        user.first_name = req.body.email.first_name;
        user.last_name = req.body.email.last_name;
        user.email = req.body.email.email;
        user.password = hashedPassword;
      
        
        await user.save();
        res.json({ msg: 'Usuario actualizado exitosamente', user });
    } catch (err) {
        console.error('este es el error: ' + err.message);
        res.status(500).send('Error del servidor');
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.params)
        let user = await User.findById(id);
        console.log(user)
        if (!user) {
            return res.status(404).json({ msg: 'Usuario no encontrado' });
        }

        await User.findByIdAndDelete(user._id); 
        res.json({ msg: 'Usuario eliminado exitosamente' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Error del servidor');
    }
};