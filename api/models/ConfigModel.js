const mongoose = require("mongoose");

const config_schema = mongoose.Schema({
  is_accepting_points: { type: Boolean, default: true }
}, { versionKey: false, capped: { max: 1, size: 1024 } } ); 

module.exports = mongoose.model('Config', config_schema);
