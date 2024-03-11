// services/email.service.js
const nodemailer = require('nodemailer');
const config = require('../config');

const sendRecoverEmail = async (email, recoverToken) => {
    // Configurar el transportador de correo electrónico (usa tu proveedor de correo electrónico o servicio SMTP)
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'tu_correo@gmail.com',
            pass: 'tu_contraseña'
        }
    });

    // Configurar el correo electrónico
    const mailOptions = {
        from: 'tu_correo@gmail.com',
        to: email,
        subject: 'Recuperación de contraseña',
        text: `Hola, haz clic en el siguiente enlace para restablecer tu contraseña: ${config.clientURL}/reset-password?token=${recoverToken}`
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);
};

module.exports = sendRecoverEmail;
