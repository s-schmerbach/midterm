// initialize environment variables
require('dotenv').config();
// import libraries
const debug = require('debug')('app:post');
const express = require('express');
const config = require('config');
const moment = require('moment');
const database = require('../database');
const multer = require('multer');
const c = require('config');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const auth = require('../middleware/auth');
const upload = multer({ storage: storage });

const router = express.Router();

//route for main feed
router.post('/', (req, res) => {
  res.redirect('/feed');
});
router.get('/', auth, async (req, res) => {
  const search = req.query.search;
  const auth = req.auth;
  const matchStage = {};
  try {
    if (search) {
      matchStage.$text = { $search: search };
    }
    const pipeline = [{ $match: matchStage }, { $sort: { _id: 1 } }];

    const post = await database.getAllPost(pipeline);
    const username = post.username;
    const user = await database.getUserByName(username);
    res.render('feed', { title: 'Feed', post, user, auth });
  } catch (err) {
    debug(err);
    next(err);
    // res.render('error/error400', { title: 'Something went wrong'});
  }
});

//route to add a post page

// const data = req.body;
// data.image = req.file.originalname;
// await database.addUser(data);

module.exports = router;
