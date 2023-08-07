const express = require('express');
const router = express.Router();
const db = require('../database/index');

router.get('/getSubgroups', (req, res) => {
  db.query('SELECT * FROM subgroup', [], function (err, result) {
    res.status(200).send({
      msg: 'Successfully get Subgroup',
      data: result,
      code: 201,
    });
  });
});

module.exports = router;
