const express = require('express');
const bcrypt = require('bcrypt');
const { Account } = require('../models/');
const { accountSignUp, accountSignIn } = require('../validators/account');
const { getMessage } = require('../helpers/validator');
const { generateJwt, generateRefreshJwt, verifyRefreshJwt, getTokenFromHeaders} = require('../helpers/jwt');


const router = express.Router();

const saltRound = 10;

router.post('/sign-in', accountSignIn, async (req, res) => {
    const { email, password } = req.body;

    const account = await Account.findOne({ where: { email } });

    if (!account) {
        return res.jsonBadRequest(null, getMessage('account.signin.invalid'));
    }

    //Validar a senha
    const match = bcrypt.compareSync(password, account.password);

    if (!match) {
        return res.jsonBadRequest(null, getMessage('account.signin.invalid'));
    }

    const token = generateJwt({ id: account.id });
    const refreshToken = generateRefreshJwt({ id: account.id, version: account.jwtVersion });

    return res.jsonOk(account, getMessage('account.signin.sucess'), { token, refreshToken });
});

router.post('/sign-up', accountSignUp, async (req, res) => {

    const { email, password } = req.body;

    const account = await Account.findOne({ where: { email } });

    if (account) {
        return res.jsonBadRequest(null, getMessage('account.signup.email_exists'));
    }

    const hash = bcrypt.hashSync(password, saltRound)
    const newAccount = await Account.create({ email, password: hash }).then().catch();

    const token = generateJwt({ id: newAccount.id });
    const refreshToken = generateRefreshJwt({ id: newAccount.id, version: newAccount.jwtVersion });

    return res.jsonOk(newAccount, getMessage('account.signup.sucess'), { token, refreshToken });
});

router.post('/refresh', async (req, res) => {
    
    const token = getTokenFromHeaders(req.headers);

    if (!token) return res.jsonUnauthorized(null, 'Invalid Token');
     
    try {
        const decoded = verifyRefreshJwt(token)
        const account = await Account.findByPk(decoded.id);

        if(!account) return res.jsonUnauthorized(null, 'Invalid Token');

        if(decoded.version !== account.jwtVersion){
            return res.jsonUnauthorized(null, 'invalid Token');
        }

        const meta = {
            token: generateJwt({id: account.id }),
        }

        return res.jsonOk(null, null, meta);

    } catch (error) {

        return res.jsonUnauthorized(null, 'invalid Token');
    }

});


module.exports = router;