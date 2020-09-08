const router = require('express').Router();
const User = require('../models/UserModel')
const { is_user, is_admin } = require('../services/auth')

router.get('/me', is_user, async (req, res) => {
    const user = req.user
    res.render('account', { user })
});

router.get('/users', is_admin, async (req, res) => {
    try {
        const users = (await User.find({}))
        res.render('users', { users })
    }
    catch (e) {
        console.log(e)
        res.send('error')
    }
});


module.exports = router;
