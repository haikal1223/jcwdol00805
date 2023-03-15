const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'raihanaditt@gmail.com', // Email Sender
        pass: 'sxvowobibltbbcwg' // Key Generate
    },
    tls: {
        rejectUnauthorized: false
    }
})

module.exports = transporter