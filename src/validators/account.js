const Joi = require('@hapi/joi');
const { getValidatorError } = require('../helpers/messages');


const rules = {
    email: Joi.string().email().required(),
    senha: Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
    password_confirmation: Joi.string().valid(Joi.ref('password')).required(),
}

const accountSignIn = (req, res, next) => {
    const { email, password } = req.body;

    const schema = Joi.object({
        email: rules.email,
        password: rules.senha,
    });

    const options = { abortEarly: false };
    const { error } = schema.validate({ email, password }, options);

    if (error) {
        const messages = getValidatorError(error, 'account.signin');
        return res.jsonBadRequest(null, null, { error: messages });
    }

    next();
}

const accountSignUp = (req, res, next) => {
    const { email, password, password_confirmation } = req.body;

    const schema = Joi.object({
        email: rules.email,
        password: rules.senha,
        password_confirmation: rules.password_confirmation,
    });

    const options = { abortEarly: false };
    const { error } = schema.validate({ email, password, password_confirmation }, options);

    if (error) {
        const messages = getValidatorError(error, 'account.signup');
        return res.jsonBadRequest(null, null, { error: messages });
    }

    next();
}

module.exports = { accountSignUp, accountSignIn };