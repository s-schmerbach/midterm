const debug = require('debug')('app:authorization:admin');

module.exports = (req, res, next) => {
  try {
    if (!req.auth) {
      throw new Error('You must be logged in.');
    }
    if (req.auth.role != 'admin') {
      throw new Error('You do not have permission to view this page.');
    }
    next();
  } catch (err) {
    debug(err.message);
    if (req.xhr) {
      res.status(403).json({ error: err.message });
    } else {
      //res.status(403).render('error/basic', { title: 'Forbidden', message: err.message });
      res.status(403).render('status/status-403', { title: 'Inner Compass - status 403', style: 'error', message: err.message, auth: req.auth });
      
    }
  }
};
