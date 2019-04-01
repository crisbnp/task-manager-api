const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY) //set up API key to associate with our account

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'crisbnp@icloud.com',
        subject: 'Welcome to Task Manager app!',
        text: `Welcome to the Task Manager app, ${name}. Hope you find the app useful, let me know how it goes!`
    })
}

const sendCancellationEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'crisbnp@icloud.com',
        subject: `Goodbye ${name}!`,
        text: `Goodbye, ${name}! Thanks for trying our app. Sad to see you go but let us know how we can make it better for you!`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancellationEmail
}