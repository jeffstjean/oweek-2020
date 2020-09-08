const path = require('path');

const dotenv = require('dotenv').config();
const express = require('express');
const cookie_parser = require('cookie-parser');
const morgan = require('morgan');
const favicon = require('serve-favicon');

const database = require('./config/mongo.js');
const User = require('./models/UserModel');

database.connect()
  .then((connection) => {
    console.log('Connected to database')
  })
  .catch(() => {
    console.log('Error connecting to database!')
    throw new Error('CouldNotConnectToDatabase'); 
  });

// app configuration
const port = 5000
const node_env = process.env.NODE_ENV || 'development'
const app = express();

// middlewares
app.use(express.urlencoded({ extended: true }));
app.use(cookie_parser());
app.use(express.json());
app.use(express.static('public'));
app.use(favicon(path.join(__dirname,'public','img','favicon.ico')));
if(node_env === 'production') app.use(morgan('combined'));
else app.use(morgan('dev'));
app.use((req, res, next) => {
  if(req.cookies && req.cookies.auth) {
    res.locals.is_logged_in = true;
    const decoded = User.decodeJWT(req.cookies.auth)
    if(decoded.role === 'admin') {
      res.locals.is_admin = true;
    }
  }
  next();
});

// ejs registration
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, '/views'))

// routes
app.use('/', require('./routes/IndexRoute'));
app.use('/', require('./routes/AuthRoute'));
app.use('/', require('./routes/UserRoute'));
app.use('/', require('./routes/CodeRoute'));
app.use('/', require('./routes/AdminRoute'));
app.use((req, res, next) => {
  if(res.statusCode === 404) {
    res.send('Not found')
  }
  else {
    res.send('Server error')
  }
})

// for debugging
if(node_env === 'development') {
  const os = require('os');
  app.get('/test', (req, res, next) => { res.send(`Hello from ${os.hostname()}`) });
}

app.listen(port, () => {
  console.log(`Server started on port ${port} in mode ${node_env}`);
});
