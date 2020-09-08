const mongoose = require('mongoose');
const Config = require('../models/ConfigModel')

const options = {
  connectTimeoutMS: 10000,
};


const connect = () => {
  return new Promise(async (resolve, reject) => {
    const uri = process.env.DB_CONNECTION;
    if(uri === undefined) {
      reject('InvalidURI'); 
    }
    // settings for depreciated features
    mongoose.set('useNewUrlParser', true);
    mongoose.set('useFindAndModify', false);
    mongoose.set('useCreateIndex', true);
    mongoose.set('useUnifiedTopology', true);
    try {
      const connection = mongoose.connect(uri, options);
      config = await Config.find({})
      if(config.length === 0) create_config()
      resolve(connection)
    }
    catch(e) {
      reject(e)
    }
  });
};

const create_config = () => {
  new Config().save();
}

module.exports = {
  connect,
  mongoose
};
