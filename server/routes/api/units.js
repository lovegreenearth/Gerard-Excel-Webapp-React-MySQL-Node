

module.exports = app => {
  app.get("/api/units", (req, res, next) => {

    let sql = "select * from units order by unit_name ASC";
    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          res.send(JSON.stringify(results));
        }
    });
  });

  app.post("/api/units", function (req, res, next) {
    let data = {
        unit_name: req.body.unit_name,
        cabinet_id: req.body.cabinet_id,
        unit_stock: req.body.unit_stock
    }

    let sql = "insert into units (unit_name, cabinet_id, unit_stock) values ('"+ data.unit_name +"', '"+ data.cabinet_id +"', '"+ data.unit_stock +"')";

    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          let sql1 = "select * from units where unit_name = '" + req.body.unit_name + "'";

          res.locals.connection.query(
            sql1, (error, results) => {
              if(error) {
                console.log(error); 
                res.json(null)
              }else{
                if(results.length != 0) {
                  res.status(201);
                  res.json(results[0]);
                }else{
                  res.status(404);
                  res.json(null);
                }
              }
          });
        }
    });
  });

  app.delete("/api/units/:id", function (req, res, next) {

    let sql = "DELETE FROM units WHERE id = " + req.params.id;
    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          res.status(201);
          res.json(true);
        }
    });
  });

  app.put("/api/units/:id", (req, res, next) => {

    let sql = "update units set unit_name = '"+ req.body.unit_name +"', cabinet_id = '"+ req.body.cabinet_id +"'";

    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          let sql1 = "select * from units where id = '" + req.params.id + "'";
          res.locals.connection.query(
            sql1, (error, results) => {
              if(error) {
                console.log(error); 
                res.json(null)
              }else{
                if(results.length != 0) {
                  res.status(201);
                  res.json(results[0]);
                }else{
                  res.status(404);
                  res.json(null);
                }
              }
          });
        }
    });
  });
};
