const { Message } = require('../models');
const QueryBuilder = require('../utils/queryBuilder');
const Email = require('../utils/email');

const index = async (req, res, next) => {
    try {
        const messageQuery = new QueryBuilder(Message, req.query, {
            setExcludedParams: ['name', 'email', 'message']
        })
            .filter()
            .limitFields()
            .sort()
            .paginate();

        const messages = await messageQuery.dbQuery;

        return res.status(200).json({
            status: 'success',
            data: {
                count: messages.length,
                messages
            }
        });
    } catch (err) {
        return next(err);
    }
};
const create = async (req, res, next) => {
    try {
        const message = await Message.create(req.body);

        if (message.subject === 'contact') {
            const notification = await new Email({
                useTemplates: true
            }).send({
                from: '"KnowSmith Dashboard" <contact@knowsmith.co>',
                to: process.env.NOTIFY_ENQUIRY_TO,
                subject: 'New CONTACT FORM Message',
                template: 'notification',
                context: {
                    message: {
                        name: message.name,
                        email: message.email,
                        message: message.message
                    },
                    dashboard: process.env.DASHBOARD_URL
                }
            });

            if (!notification.messageId) {
                return next(new Error('Email could not be sent! Sorry...'));
            }

            return res.status(201).json({
                status: 'success',
                data: {
                    message:
                        'Your message was received. We will get back to you in a while. Thank you!'
                }
            });
        }

        return res.status(201).json({
            status: 'success',
            data: {
                message
            }
        });
    } catch (err) {
        return next(err);
    }
};
const show = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id).select('-__v');

        if (!message) {
            throw new Error('Cannot find message with given ID.');
        }

        return res.status(200).json({
            status: 'success',
            data: {
                message
            }
        });
    } catch (err) {
        return next(err);
    }
};
const update = async (req, res, next) => {
    try {
        const message = await Message.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!message) {
            throw new Error('Cannot find message with given ID.');
        }

        return res.status(200).json({
            status: 'success',
            data: {
                message
            }
        });
    } catch (err) {
        return next(err);
    }
};
const remove = async (req, res, next) => {
    try {
        const message = await Message.findByIdAndDelete(req.params.id);

        if (!message) {
            throw new Error('Cannot find message with given ID.');
        }

        return res.status(200).json({
            status: 'success',
            data: {
                message
            }
        });
    } catch (err) {
        return next(err);
    }
};
const reply = async (req, res, next) => {
    try {
        const message = await Message.findById(req.params.id).select('-__v');

        // TODO: Attach an onboarding template, and attach onboarding attachments on those emails
        const notification = await new Email().send({
            from: '"Fred Foo 👻" <foo@example.com>', // sender address
            to: message.email, // list of receivers
            replyTo: '<Dictated by loggeIn admin> admin@knowsmith.co',
            subject: 'Welcome to Knowsmith!', // Subject line
            text: JSON.stringify(message) // plain text body
        });

        if (!notification.messageId) {
            return next(new Error('Email could not be sent! Sorry...'));
        }

        return res.status(201).json({
            status: 'success',
            data: {
                message: 'Email sent successfully.'
            }
        });
    } catch (err) {
        return next(err);
    }
};

module.exports = {
    index,
    create,
    show,
    update,
    remove,
    reply
};
