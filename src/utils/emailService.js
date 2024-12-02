const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    }
});

async function sendVerificationEmail(recipientEmail, code) {
    const mailOptions = {
        from: '"GoldFront Bank" <no-reply@goldfront.com>',
        to: recipientEmail,
        subject: 'GoldFront Bank - Account Verification',
        html: `<h2>Hi!</h2><hr/><p style="background: grey;">Your verification code is: <strong>${code}</strong></p>`
    };

    console.log("sending OTP to email: ", recipientEmail, " [OTP Code: ", code, "]");
    return transporter.sendMail(mailOptions);
}

module.exports = { sendVerificationEmail };