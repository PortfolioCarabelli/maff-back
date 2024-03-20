const fs = require('fs');
const nodemailer = require('nodemailer');
const path = require('path');
const config = require('../config/config');

const IMAGE_DIR = path.join(__dirname, 'EmailHelper', 'images');
const HTML_TEMPLATE_PATH = path.join(__dirname, 'EmailHelper', 'indexResetPassword.html');

const sendRecoverEmail = async (email, recoverToken) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'codercraftsolutions@gmail.com',
                pass: 'kwmn qysh jwno ybnw'
            }
        });

        const htmlTemplate = fs.readFileSync(HTML_TEMPLATE_PATH, 'utf8');

        const mailOptions = {
            from: 'codercraftsolutions@gmail.com',
            to: email,
            subject: 'Recuperación de contraseña',
            html: htmlTemplate,
            attachments: [
                {
                    filename: 'image-1.png',
                    path: path.join(IMAGE_DIR, 'image-1.png'),
                    cid: 'image1@codercraftsolutions.com' // Referencia única para la imagen en el HTML
                },
                {
                    filename: 'image-2.png',
                    path: path.join(IMAGE_DIR, 'image-2.png'),
                    cid: 'image2@codercraftsolutions.com' // Referencia única para la imagen en el HTML
                }
            ]
        };

        // Reemplazar las variables dinámicas en el HTML con las URLs de las imágenes adjuntas
        mailOptions.html = mailOptions.html
            .replace('{{IMAGE_SRC}}', `cid:image1@codercraftsolutions.com`)
            .replace('{{IMAGE_SRC_FOTTER}}', `cid:image2@codercraftsolutions.com`)
            .replace('{{RESET_LINK}}', `${config.clientURL}/reset-password?token=${recoverToken}`);

        await transporter.sendMail(mailOptions);

        console.log('Correo electrónico enviado exitosamente');
    } catch (error) {
        throw new Error('Error al enviar el correo electrónico:', error);
    }
};

module.exports = sendRecoverEmail;
