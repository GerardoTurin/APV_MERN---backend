import nodemailer from 'nodemailer';


const emailRegistro = async (datos) => {
    let transporter = nodemailer.createTransport({
        pool: true,
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      const { email, nombre, token } = datos;

      // Enviamos el email
      const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Bienvenido a APV",
        text: "Bienvenido a APV",
        html: `<p>Estimado ${nombre}, comprueba tu cuenta en APV</p>
              <p>Para confirmar tu cuenta, haz click en el siguiente enlace: 
              <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Confirmar Cuenta</a></p>

              <p>Si no has solicitado este email, ignoralo</p>
        `
      });

      console.log("Mensaje Enviado: %s", info.messageId);
  }


export default emailRegistro;