const config = require('config');
const jwt = require('jsonwebtoken');
const debug = require('debug')('app:middleware:authentication');


module.exports = (req, res, next) => {
  try {
    const token = req.cookies.iced_cookie;
    if (!token) {
      throw Error('missing token');
    }
    const secret = config.get('auth.secret');
    if (!secret) {
      throw Error('secret not configured');
    }
    const payload = jwt.verify(token, secret);
    req.auth = payload;
    next();
  } catch (err) {
    debug(err.message);
    if (req.xhr) {
      res.status(401).json({ error: err.message });
    } else {
      res.redirect('/login');
    }
  }
};
