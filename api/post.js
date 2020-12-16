const express = require('express');
const config = require('config');
const Joi = require('joi');
const debug = require('debug')('app.api.post');
const database = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const router = express.Router();

const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const sendError = (err, res) => {
  debug(err);
  if (err.isJoi) {
    res.json({ error: err.details.map((e) => e.message).join('\n') });
  } else {
    res.json({ error: err.message });
  }
};

router.post('/add', upload.single('image'), async (req, res) => {
  debug(req.body)
  const schema = Joi.object({
    username: Joi.string().min(1).required(),
    image: Joi.string().allow(''),
    description: Joi.string().min(1).required(),
  });
  try {
    const data = await schema.validateAsync(req.body);
    data.image = req.file.originalname;
    await database.addPost(data);
    res.json(data);
  } catch (err) {
    debug(err);
    sendError(err, res);
  }
});

module.exports = router;
