const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/jwt')

const SALT_ROUNDS = 10;

const user_schema = mongoose.Schema({
  username: { type: String, required: 'A username is required' },
  displayname: { type: String, required: 'A displayname is required' },
  points: { type: Number, default: 0 },
  codes: { type: Array, default: [] },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { versionKey: false } );

user_schema.methods.generateJWT = function() {
  const expiry = '7d';
  return jwt.sign({
    _id: this._id,
    displayname: this.displayname,
    role: this.role
  }, JWT_SECRET, { expiresIn: expiry });
};

user_schema.statics.decodeJWT = function(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  }
  catch(e) {
    return false;
  }
}

module.exports = mongoose.model('User', user_schema);
