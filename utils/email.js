const path = require('path');
const nodemailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');

class Email {
    constructor(options) {
        const useTemplates = options.useTemplates || 'false';
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: false,
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD
            }
        });

        if (useTemplates) {
            this.transporter.use(
                'compile',
                hbs({
                    extName: '.hbs',
                    viewPath: './views/email-templates',
                    viewEngine: {
                        partialsDir: 'views',
                        layoutsDir: 'views',
                        defaultLayout: ''
                    }
                })
            );
        }
    }

    async send(options) {
        return await this.transporter.sendMail(options);
    }
}

module.exports = Email;
