const express = require('express');
const router = express.Router();
const db = require('../database/index');

router.get('/getList', (req, res) => {
  var whereQuery = "";
  var params = [];
  if (req.query.search || req.query.main || req.query.sub) {
    whereQuery += " WHERE";
  }
  if (req.query.search) {
    whereQuery += " `code` LIKE '%" + req.query.search + "%' ";
  }
  if (req.query.main) {
    if (req.query.search) {
      whereQuery += " AND `group` = ? ";
    } else {
      whereQuery += " `group` = ? ";
    }
    params.push(parseInt(req.query.main));
  }
  if (req.query.sub) {
    if (req.query.main) {
      whereQuery += " AND `subGroup` = ? ";
    } else {
      whereQuery += " `subGroup` = ? ";
    }
    params.push(parseInt(req.query.sub));
  }

  const query = "SELECT * FROM products" + whereQuery;
  db.query(query, params, function (err, result) {
    res.status(200).send({
      msg: 'Successfully get Products',
      data: result,
      code: 201,
    });
  });
});

module.exports = router;
