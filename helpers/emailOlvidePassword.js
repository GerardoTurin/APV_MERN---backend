import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
    let transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });

    const { email, nombre, token } = datos;

    // Enviamos el email
    const info = await transporter.sendMail({
        from: "APV - Administrador de Pacientes de Veterinaria",
        to: email,
        subject: "Reestablecer tu Password",
        text: "Reestablecer tu Password",
        html: `<p>Estimado ${nombre}, has solicitado reestablecer tu password</p>
                <p>Para generar un nuevo password sigue el siguiente enlace: 
                <a href="${process.env.FRONTEND_URL}/olvida-password/${token}">Reestablecer Password</a></p>

                <p>Si no has solicitado este email, ignoralo</p>
        `,
    });

    console.log("Mensaje Enviado: %s", info.messageId);
};

export default emailOlvidePassword;