const { Schema, model } = require('mongoose');
const { isEmail } = require('validator');

const messageSchema = new Schema(
    {
        name: {
            type: String,
            required: [true, `Message should have sender's name.`]
        },
        email: {
            type: String,
            required: [true, `Message should have a sender's email.`],
            validate: {
                validator: function (val) {
                    return isEmail(val);
                },
                message: `Sender's email needs to be a valid email`
            }
        },
        subject: {
            type: String,
            default: 'contact',
            enum: {
                values: ['contact', 'email', 'phone'],
                message:
                    'Message subject can be either: contact, phone, or email'
            }
        },
        message: {
            type: String,
            required: [true, `Message should have a body.`]
        },
        folder: {
            type: String,
            default: 'inbox',
            enum: {
                values: ['inbox', 'important', 'spam'],
                message:
                    'Message folder can be either: inbox, important, or spam'
            }
        },
        replied: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true
    }
);

const Message = model('Message', messageSchema);

module.exports = Message;
