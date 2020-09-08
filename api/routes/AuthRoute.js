const router = require('express').Router();
const User = require('../models/UserModel')
const Filter = require('bad-words');
const filter = new Filter();

router.get('/signup', (req, res) => {
    res.render('signup');
});

router.post('/signup', async (req, res) => {
    res.clearCookie('auth')
    if(filter.isProfane(req.body.displayname)) {
        return res.render('signup', { alerts: ['Please enter an appropriate display name.'] });
    }
    try {
        const existing_user = await User.findOne({ username: req.body.username });
        if(existing_user) {
            console.log('User already exists')
            return res.render('signup', { alerts: ['Username already exists.'] });
        }
        else {
            console.log('attempting to create new user')
            try {
                const new_user = await new User(req.body).save();
                console.log('created new user')
                const token = new_user.generateJWT();
                res.cookie('auth', token);
                return res.redirect('/me');
            }
            catch(e) {
                if (e.name == 'ValidationError') {
                    alerts = [];
                    for (field in e.errors) alerts.push(e.errors[field].message)
                    console.log(alerts)
                    return res.render('signup', { alerts });
                }
                else {
                    return res.render('signup', { alerts: ['There was an issue. Please try again later.'] });
                }
            }
        }
    }
    catch(e) {
        console.log(e)
        return res.render('signup', { alerts: ['There was an issue. Please try again later.'] });
    }
});

router.get('/login', (req, res) => {
    res.render('login');
});

router.post('/login', async (req, res) => {
    res.clearCookie('auth')
    console.log(req.body)
    try {
        const user = await User.findOne({ username: req.body.username });
        if(user) {
            const token = user.generateJWT();
            res.cookie('auth', token);
            res.redirect('/me');
        }
        else {
            return res.render('login', { alerts: ['Invalid username'] });
        }
    }
    catch(e) {
        console.log(e)
        return res.render('login', { alerts: ['There was an issue. Please try again later.'] });
    }
});

router.get('/logout', async (req, res) => {
    res.clearCookie('auth')
    res.redirect('/')
});


module.exports = router;
