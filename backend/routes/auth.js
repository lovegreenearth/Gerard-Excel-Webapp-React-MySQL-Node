const express = require('express');
const router = express.Router(); // Creating a router object.
const db = require('../database/index');
const bcrypt = require('bcrypt'); // A library that is used to hash passwords.
const { encrypt, decrypt } = require('../module/myCrypto');
const { isEmail, checkUsername } = require('../module/check_userOrEmail');
const { creatSessionOnDB, getSessionOnDB, setSessionOnDB, compareSessionOnDB, destroySessionOnDB } = require('../module/session');
const { clearAllcookie, getSessionIDCookie } = require('../module/cookie');

const saltRounds = 10; // The number of rounds to use when generating a salt
// bcrypt.hash(password, saltRounds, (err, hash) => {});

router.post('/register', (req, res) => {
  const name = req.body.name;
  const email = req.body.email;
  const company = req.body.company;
  const password = req.body.password;

  if (!isEmail(email)) {
    res.status(203).send({
      msg: 'Invalid email',
      code: 101,
    });
    return;
  }

  if (password.length < 8) {
    return res.status(203).send({
      msg: 'Password must be at least 8 characters long.',
    });
  }

  if (password) {
    bcrypt.hash(password, saltRounds, (err, hash) => {
      db.query('SELECT * FROM users WHERE email = ?', [email], function (err, result) {
        if (err)
          throw res.status(500).send({
            msg: err,
          });
        if (result.length == 0) {
          /* This is inserting the data into the database. */
          db.query('INSERT INTO users (name, email, company, password) VALUE (?,?,?,?)',
            [name, email, company, hash], (error, response) => {
              if (error) {
                res.status(500).send({
                  msg: error,
                });
              } else if (err) {
                res.status(500).send({
                  msg: err,
                });
              } else {
                res.status(200).send({
                  msg: 'User successfully registered',
                  code: 201,
                });
              }
            });
        } else {
          res.status(203).send({
            msg: 'Email already registered',
            code: 100,
          });
        }
      });
    });
  }
});

router.post('/login', (req, res) => {
  const email = req.body.email.toLowerCase();
  const password = req.body.password;
  if (!isEmail(email)) {
    res.status(203).send({
      msg: 'Invalid email',
      code: 102,
    });
    return;
  }

  db.query('SELECT * FROM users WHERE email = ?', [email], (err, result) => {
    if (err) res.status(500).send(err);
    if (result.length > 0) {
      bcrypt.compare(password, result[0].password, (error, response) => {
        if (error) {
          res.status(500).send(error);
        } else if (err) {
          res.status(500).send(err);
        }
        if (response == true) {
          if (req.user) {
            res.status(200).send({
              user: req.user,
              code: 105,
            });
          } else {
            console.log('User not logged in');
            req.user = {
              name: result[0].name,
              email: email,
              company: result[0].company,
              loggedIn: true,
            };
            // getSessionIDCookie(req, res);
            // creatSessionOnDB(req);
            res.status(200).send({
              msg: 'successfully',
              user: req.user,
              code: 105,
            });
          }
        } else {
          res.status(203).send({
            msg: 'Email or password incorrect',
            code: 105,
          });
        }
      });
    } else {
      res.status(203).send({
        msg: 'Not registered user!',
        code: 104,
      });
    }
  });
});

router.get('/logout', (req, res, next) => {
  console.log(req.session);
  var destroySession = destroySessionOnDB(req.session.user.userID);
  console.log('logout completed', destroySession);
  req.session.destroy();
  clearAllcookie(req, res);
  res.status(200).json({ req: req.session });
  next();
});

/* This is exporting the router object. */
module.exports = router;
