require('dotenv').config()
const nodemailer = require('nodemailer')
const xoauth2 = require('xoauth2')

//
// const transporter = nodemailer.createTransport({
//     service: 'gmail',
//     auth: {
//         type: 'OAuth2',
//         user: process.env.MAIL_USERNAME,
//         pass: process.env.MAIL_PASSWORD,
//         clientId: process.env.OAUTH_CLIENTID,
//         clientSecret: process.env.OAUTH_CLIENT_SECRET,
//         refreshToken: process.env.OAUTH_REFRESH_TOKEN
//     }
// })
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD
    }
})

const sendMail = (userEmail, accessCode) => {
    const mailOptions = {
        from: 'medical.follow.up.ca@gmail.com',
        to: userEmail,
        subject: 'Your Access Code',
        html: '<div>Hi,  <br> your access code is: <b>' + accessCode + '</b>.<br><br> ' +
        'Please use your email address and this access code to connect to CARE. </div>'
    }

    transporter.sendMail(mailOptions, function (err, data) {
        if (err) {
            console.log('Error ' + err)
        } else {
            console.log('Email sent successfully')
            console.log(userEmail)
        }
    })
}
module.exports = sendMail
