// initialize environment variables
require('dotenv').config();
// import libraries
const debug = require('debug')('app:server');
const express = require('express');
const hbs = require('express-handlebars');
const config = require('config');
const moment = require('moment');
const database = require('./database');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
morgan('tiny');
// create and configure application
const app = express();
app.engine(
  'handlebars',
  hbs({
    helpers: {
      formatPrice: (price) => {
        return price == undefined ? '$0.00' : '$' + price.toFixed(2);
      },
      formatDate: (date) => moment(date).format('MMMM Do YYYY'),
      fromNow: (date) => moment(date).fromNow(),
      not: (value) => !value,
      eq: (a, b) => a == b,
      or: (a, b) => a || b,
      and: (a, b) => a && b,
      tern: (condition, a, b) => (condition ? a : b),
    },
  })
);
app.set('view engine', 'handlebars');
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static('public'));
app.use('/api/post', require('./api/post'));
app.use('/api/user', require('./api/user'));

 app.use('/', require('./routes/user'));
app.use('/feed', require('./routes/post'));


// start app
const hostname = process.nextTick.HOSTNAME || 'localhost';
const port = process.env.PORT || 3000;
app.listen(port, debug(`Server running at http://${hostname}:${port}/`));
