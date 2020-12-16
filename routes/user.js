// initialize environment variables
require('dotenv').config();
// import libraries
const debug = require('debug')('app:user');
const express = require('express');
const config = require('config');
const moment = require('moment');
const database = require('../database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
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

const router = express.Router();

const auth = require('../middleware/auth');

// done
router.get('/', async (req, res) => {
  res.render('home', { title: 'Home' });
});

//done?
router.get('/login', async (req, res) => {
  try {
    res.render('login', { title: 'Login' });
  } catch (err) {
    debug(err);
    res.render('error/error400', { title: 'Something went wrong' });
  }
});

//done
router.post('/login', async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  try {
    if (username && password) {
      const user = await database.getUserByName(username);
      if (user && (await bcrypt.compare(password, user.password))) {
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
        res.redirect(`/profile/${username}`);
      } else {
        throw new Error('No account with this username and password found.');
      }
    } else {
      if (!username) {
        throw new Error('Please enter a username');
      }
      if (!password) {
        throw new Error('Please enter a password');
      }
    }
  } catch (err) {
    debug(err);
    res.render('login', {
      title: 'Login',
      err,
    });
  }
});

// done
router.get('/register', async (req, res) => {
  try {
    res.render('register', { title: 'Register' });
  } catch (err) {
    debug(err);
    res.render('error/error400', { title: 'Something went wrong' });
  }
});

router.get('/profile/:username', auth, async (req, res) => {
  const auth = req.auth;
  const username = req.params.username;
  try {
    const post = await database.getPostByName(username);
    res.render('profile', { title: `${username} Profile`, post, username, auth });
  } catch (err) {
    debug(err);
  }
});

router.get('/delete/:username', auth, async (req, res) => {
  const auth = req.auth;
  const username = req.params.username;
  try {
    const user = await database.getUserByName(username);
    res.render('delete', { title: 'Delete Account', user, username, auth });
  } catch (err) {
    debug(err);
    res.render('error/error400', { title: 'Something went wrong' });
  }
});
router.get('/delete/redirect/:username', async (req, res) => {
  const username = req.params.username;
  try {
    debug(username);
    const profile = await database.getUserByName(username);
    await database.deleteUser(profile._id);
    await database.deletePost(username);

    res.redirect('/');
  } catch (err) {
    debug(err);
    next(err);
  }
});

router.get('/post/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const user = await database.getUserByName(username);
    res.render('post', { title: 'Add post', username: user.username });
  } catch (err) {
    debug(err);
    next(err);
    res.render('error/error400', { title: 'Something went wrong' });
  }
});

router.get('/edit/:username', async (req, res) => {
  const username = req.params.username;
  try {
    const user = await database.getUserByName(username);
    res.render('Edit', { title: 'Edit post', user });
  } catch (err) {
    debug(err);
    next(err);
    res.render('error/error400', { title: 'Something went wrong' });
  }
});

//route from register that goes to profile page

// router.get('', async (req, res) => {
//   try {

//   } catch (err) {
//     debug(err);
//     next(err);
//   }
// });
module.exports = router;
