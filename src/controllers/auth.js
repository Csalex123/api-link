const express = require('express');

const router = express.Router();

router.get('/sign-in', (req, res) => {
    return res.json('sign-in');
});

router.get('/sign-out', (req, res) => {
    return res.json("Sign-up");
});


module.exports = router;