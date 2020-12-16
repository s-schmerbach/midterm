const express = require('express');
const config = require('config');
const Joi = require('joi');
const debug = require('debug')('app.api.user');
const database = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const auth = require('../middleware/auth');

const sendError = (err, res) => {
  debug(err);
  if (err.isJoi) {
    res.json({ error: err.details.map((e) => e.message).join('\n') });
  } else {
    res.json({ error: err.message });
  }
};
router.post('/register', async (req, res) => {
  debug('hello reg');
  const schema = Joi.object({
    username: Joi.string().min(1).required(),
    password: Joi.string().min(1).required(),
    con_password: Joi.ref('password'),
    email: Joi.string().email().required(),
  });
  try {
    const data = await schema.validateAsync(req.body);
    data.password = await bcrypt.hash(data.password, config.get('auth.saltRounds'));
    if (await database.getUserByName(data.username)) {
      const err = new Error();
      err.message = 'Username is unavailable';
      throw err;
    }
    if (await database.getUserByEmail(data.email)) {
      const err = new Error();
      err.message = 'Email is already registered';
      throw err;
    }
    delete data.con_password;

    await database.addUser(data);
    const user = await database.getUserByName(data.username);

    const secret = config.get('auth.secret');
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, secret, { expiresIn: '120h' });
    res.cookie('iced_cookie', token, {
      maxAge: 1000 * 60 * 60 * 24 * 5,
    });
    res.json(data.username);
  } catch (err) {
    debug(err);
    sendError(err, res);
  }
});

router.post('/edit', auth, async (req, res) => {
  debug('hllo');
  const auth = req.auth;
  const schema = Joi.object({
    id: Joi.string().min(1).required(),
    password: Joi.string().min(4).required(),
    con_password: Joi.ref('password'),
    email: Joi.string().email().required(),
  });
  try {
    const data = await schema.validateAsync(req.body);
    data.password = await bcrypt.hash(data.password, config.get('auth.saltRounds'));
    delete data.con_password;
    const user = await database.getUserByName(auth.username);
    await database.updateUser(data);
    const secret = config.get('auth.secret');
    res.clearCookie('iced_cookie');
    const payload = {
      id: user._id,
      username: user.username,
      role: user.role,
    };
    const token = jwt.sign(payload, secret, { expiresIn: '120h' });
    res.cookie('iced_cookie', token, {
      maxAge: 1000 * 60 * 60 * 24 * 5,
    });
    res.json(data.username);
  } catch (err) {
    debug(err);
    sendError(err, res);
  }
});

module.exports = router;
