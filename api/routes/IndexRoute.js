const router = require('express').Router();
const User = require('../models/UserModel')
const { is_user } = require('../services/auth')

const NUM_TOP_USERS = 5;

router.get('/', async (req, res) => {
    try {
        let users = (await User.find({}).sort({points: -1}).exec()).map(user => { return { displayname: user.displayname, points: user.points } });
        const top_ten = (users.length < NUM_TOP_USERS) ? users.slice(0, users.length) : users.slice(0, NUM_TOP_USERS);
        res.render('index', { top_ten });
    }
    catch(e) { 
        console.log(e)
        return res.render('index')
    }
});


module.exports = router;
