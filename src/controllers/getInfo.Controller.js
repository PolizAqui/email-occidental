const nodemailer = require('nodemailer');
const { google } = require('googleapis');
const { CLIENT_ID, CLIENT_SECRET, REFRESH_TOKEN } = require('../global/_var');
const path = require('path');

const oauth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    'https://developers.google.com/oauthplayground'
);

oauth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

async function sendMail(toEmail, docPath, nombre, poliza, femision, fcobro,fechaVencimiento) {
    try {
        const accessTokenInfo = await oauth2Client.getAccessToken();
        const accessToken = accessTokenInfo.token;
        
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: 'OAuth2',
                user: 'polizaqui.contact@gmail.com',
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken
            }
        });

        const mailOption = {
            from: 'PolizaSupport <polizaqui.contact@gmail.com>',
            to: toEmail,
            subject: 'Poliza Emitida',
            html: `
            <div style="font-family: 'Poppins', sans-serif; background-color: #f7f8fc; color: #424242; margin: 0; padding: 0;">
                <div style="width: 90%; max-width: 600px; margin: auto; background-color: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 15px rgba(0, 0, 0, 0.1);">
                    <div style="text-align: center; padding: 10px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
                            <img src="cid:logo" style="max-width: 150px; height: auto;" alt="PolizaAqui">
                        </div>
                           <div style="display: flex; justify-content: space-between; align-items: center; padding: 10px 0;">
                            <img src="cid:logo1" style="max-width: 150px; height: auto;" alt="PolizaAqui">
                        </div>
                    </div>
                    <div style="padding: 20px; text-align: left;">
                        <h1 style="color: #EB018A; font-size: 24px; margin-bottom: 20px;">¡Felicidades! Tu Seguro ${fcobro} de La Occidental está Activo</h1>
                        <p>Estimado ${nombre},</p>
                        <p>Nos complace informarte que tu seguro de ${fcobro} con La Occidental ha sido activado con éxito a través de PolizaAqui.</p>
                        <div style="margin: 20px 0;">
                            <h2>Detalles de tu Póliza:</h2>
                            <table style="width: 100%; border-collapse: collapse;">
                                <tr>
                                    <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f7f7f7;">Aseguradora</th>
                                    <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">La Mundial</td>
                                </tr>
                                <tr>
                                    <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f7f7f7;">Tipo de Seguro</th>
                                    <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${fcobro}</td>
                                </tr>
                                <tr>
                                    <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f7f7f7;">Número de Póliza</th>
                                    <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${poliza}</td>
                                </tr>
                                <tr>
                                    <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f7f7f7;">Fecha de Inicio</th>
                                    <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${femision}</td>
                                </tr>
                                <tr>
                                    <th style="padding: 10px; border: 1px solid #dddddd; text-align: left; background-color: #f7f7f7;">Fecha de Vencimiento</th>
                                    <td style="padding: 10px; border: 1px solid #dddddd; text-align: left;">${fechaVencimiento}</td>
                                </tr>

                            </table>
                        </div>
                        <p>Puedes descargar tu póliza en formato PDF a través del siguiente enlace: <a href="${docPath}" style="color: #EB018A; text-decoration: none;">Descargar PDF</a></p>
                        <p>¿Necesitas Ayuda? Si tienes alguna duda o necesitas asistencia, no dudes en contactarnos:</p>
                        <p>Correo Electrónico: <a href="mailto:info@polizaqui.com" style="color: #EB018A; text-decoration: none;">info@polizaqui.com</a></p>
                        <p>Teléfono: 0414-2121541</p>
                        <p>Gracias por confiar en PolizaAqui y en La Occidental por tu servicio ${fcobro}.</p>
                        <p>Saludos cordiales,</p>
                        <p>Equipo PolizAqui</p>
                    </div>
                    <div style="text-align: center; padding: 10px 0;">
                        <p>&copy; 2024 PolizAqui. Todos los derechos reservados.</p>
                    </div>
                </div>
            </div>
            `,
            attachments: [
                {
                    filename: 'logotipo.jpeg',
                    path: path.join(__dirname, '../assets/logotipo.jpeg'),
                    cid: 'logo'
                },
                {
                    filename: 'logo_laoccidental.png',
                    path: path.join(__dirname, '../assets/logo_laoccidental.png'),
                    cid: 'logo1'
                },
            ]
        };

        const result = await transport.sendMail(mailOption);
        console.log(`Email sent successfully to ${toEmail}`);
        return result;

    } catch (err) {
        console.error('Error in sendMail function:', err);
        return err;
    }
}

const controller = {};

controller.PolizaDoc = async (req, res) => {
    try {
        // Imprimir los datos recibidos para confirmación
        console.log('Datos recibidos:', req.body);

        const { correo_titular, poliza, fecha_emision, nombre_titular, fecha_cobro, urlpoliza, fecha_inicio, numeroPoliza, fecha_vencimiento } = req.body;

        console.log('Detalles específicos del correo:', { correo_titular, poliza, fecha_emision, nombre_titular, fecha_cobro, urlpoliza, fecha_vencimiento });

        // Suponiendo que 'urlpoliza' es la URL del documento PDF
        const mailResult = await sendMail(correo_titular, urlpoliza, nombre_titular, poliza, fecha_emision, fecha_cobro, fecha_vencimiento);

        if (mailResult instanceof Error) {
            res.status(500).json({ error: 'Error al enviar el correo electrónico' });
        } else {
            // Incluir la URL de la póliza en la respuesta
            res.status(200).json({
                message: 'Correo enviado con éxito',
                mailResult,
                urlPoliza: urlpoliza,
            });
        }
    } catch (err) {
        console.error('Server error:', err);
        res.status(500).json({ error: 'Error en el Servidor' });
    }
};


module.exports = controller;
