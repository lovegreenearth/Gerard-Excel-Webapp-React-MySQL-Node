const express = require('express');
const router = express.Router();
const db = require('../database/index');

router.get('/getMaingroups', (req, res) => {
  db.query('SELECT * FROM maingroup', [], function (err, result) {
    res.status(200).send({
      msg: 'Successfully get Maingroup',
      data: result,
      code: 201,
    });
  });
});

module.exports = router;
