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
    whereQuery += " (`code` LIKE '%" + req.query.search + "%' OR `description` LIKE '%" + req.query.search + "%')";
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

  const query = "SELECT * FROM products" + whereQuery + " ORDER BY `group` ASC, `subGroup` ASC ";
  db.query(query, params, function (err, result) {
    res.status(200).send({
      msg: 'Successfully get Products',
      data: result,
      code: 201,
    });
  });
});

router.post("/add", (req, res) => {
  try {
    if (req.body) {
      db.query("SELECT * FROM products WHERE code = ?", [req.body.code], (err, result) => {
        if (err)
          throw res.status(500).send({
            msg: err,
          });
        if (result.length > 0) {
          res.status(203).send({
            msg: 'Code already exists',
            code: 100,
          });
        } else {
          const code = req.body.code;
          const description = req.body.description;
          const group = req.body.group;
          const subgroup = req.body.subgroup;
          const price = req.body.price;
          const weight = req.body.weight;
          const discount = req.body.discount;
          db.query('INSERT INTO products (`code`, `description`, `group`, `subgroup`, `price`, `weight`, `maxDiscount`) VALUE (?,?,?,?,?,?,?)',
            [code, description, group, subgroup, price, weight, discount], (error, response) => {
              if (error) {
                res.status(500).send({
                  msg: error,
                });
              } else {
                res.status(200).send({
                  msg: 'Product successfully created',
                  code: 201,
                });
              }
            }
          );
        }
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: err,
    });
  }
});

router.put("/edit/:id", (req, res) => {
  try {
    if (req.params.id) {
      db.query("SELECT * FROM products WHERE id = ?", [req.params.id], (error, result) => {
        if (error)
          throw res.status(500).send({
            msg: error,
          });

        if (result.length > 0) {
          const code = req.body.code;
          const description = req.body.description;
          const group = req.body.group;
          const subgroup = req.body.subgroup;
          const price = req.body.price;
          const weight = req.body.weight;
          const discount = req.body.discount;
          db.query("UPDATE products SET `code`=?, `description`=?, `group`=?, `subgroup`=?, `price`=?, `weight`=?, `maxDiscount`=? WHERE id=?",
            [code, description, group, subgroup, price, weight, discount, req.params.id], (err, response) => {
              if (error) {
                res.status(500).send({
                  msg: error,
                });
              } else {
                res.status(200).send({
                  msg: 'Product successfully updated',
                  code: 201,
                });
              }
            })
        }
      })
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      msg: err
    });
  }
})

router.delete("/delete/:id", (req, res) => {
  if (req.params.id) {
    db.query('DELETE FROM products WHERE id = ?', [req.params.id], (error, response) => {
      if (error) {
        res.status(500).send({
          msg: error,
        });
      } else {
        res.status(200).send({
          msg: 'Product successfully deleted',
          code: 201,
        });
      }
    });
  }
});

router.get("/:id", (req, res) => {
  if (req.params.id) {
    db.query('SELECT * FROM products WHERE id = ?', [req.params.id], (error, response) => {
      if (error) {
        res.status(500).send({
          msg: error,
        });
      } else {
        res.status(200).send({
          msg: 'Product successfully deleted',
          data: response[0],
          code: 201,
        });
      }
    });
  }
});

module.exports = router;
