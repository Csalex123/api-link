const express = require('express');
const bcrypt = require('bcrypt');
const {Account} = require('../models');

const router = express.Router();

const saltRound = 10;

router.get('/sign-in', (req, res) => {
    return res.json('sign-in');
});

router.post('/sign-up', async(req, res) => {

    const {email, password} = req.body;

    const account = await Account.findOne({where: {email} });

    if(account){
        return res.jsonBadRequest(null, "Account already exists");
    }
   
    const hash = bcrypt.hashSync(password, saltRound)

    const newAccount = await Account.create({email, password: hash}).then().catch();

    return res.jsonOk(newAccount, "Account created.");
});


module.exports = router;