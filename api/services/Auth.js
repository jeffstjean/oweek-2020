const User = require('../models/UserModel')

const decode_user = async (req, res) => {
    if(!req.cookies) {
        console.log('No cookies')
        return { user: null, err: 'Need to login' };
    }
    const token = req.cookies.auth;
    if(!token) {
        console.log('No token')
        return { user: null, err: 'Need to login' };
    }
    const decoded = await User.decodeJWT(token);
    if(!decoded) {
        console.log('Invalid token')
        return { user: null, err: 'Invalid token' };
    }
    try {
        const user = await User.findById(decoded._id);
        if(!user) {
            console.log('Could not find user')
            return { user: null, err: 'Invalid token (user does not exist).' } ;
        }
        else {
            return { user: user, err: null };
        }
    }
    catch (e) {
        console.log('Error finding user');
        return { user: null, err: 'Error finding user' } ;
    }
}

const is_admin = async (req, res, next) => {
    const { user, err } = await decode_user(req)
    if(err) {
        res.clearCookie('auth')
        res.send(err)
    }
    else {
        req.user = user;
        if(user.role === 'admin') {
            next();
        }
        else {
            res.send('Unauthorized');
        }
    }
}

const is_user = async (req, res, next) => {
    try {
        const { user, err } = await decode_user(req)
        if(err) {
            res.clearCookie('auth')
            res.redirect(`/login?q=req.url`)
        }
        else {
            req.user = user;
            next();
        }
    }
    catch(e) {
        console.log(e)
        next(e);
    }
}

module.exports = {
    is_user,
    is_admin
}