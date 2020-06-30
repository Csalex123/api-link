const express = require('express');
const bcrypt = require('bcrypt');
const {Account} = require('../models');

const router = express.Router();

const saltRound = 10;

router.get('/sign-in', (req, res) => {
    return res.json('sign-in');
});

router.get('/sign-up', async(req, res) => {

    const email = "alex@teste.com";
    const password = "123456";

   
    const hash = bcrypt.hashSync(password, saltRound)

    console.log(hash);

    const result = await Account.create({email, password: hash}).then().catch();

    return res.json(result);
});


module.exports = router;