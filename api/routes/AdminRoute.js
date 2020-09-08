const router = require('express').Router();
const { is_admin } = require('../services/auth')
const Config = require('../models/ConfigModel')
const User = require('../models/UserModel')
const Code = require('../models/CodeModel')

router.get('/admin', (req, res) => {
    res.redirect('/settings');
})

router.get('/settings', is_admin, async (req, res) => {
    try {
        const config = (await Config.find({}))[0]
        res.render('settings', { is_accepting_points: config.is_accepting_points })
    }
    catch (e) {
        console.log(e)
        res.send('error')
    }
});

router.post('/settings', is_admin, async (req, res) => {
    try {
        let config = (await Config.find({}))[0]
        if(req.body.form === 'accepting') {
            config.is_accepting_points = !config.is_accepting_points
        }
        config = await config.save();
        res.render('settings', { is_accepting_points: config.is_accepting_points })
    }
    catch (e) {
        console.log(e)
        res.send('error')
    }
});


module.exports = router;
