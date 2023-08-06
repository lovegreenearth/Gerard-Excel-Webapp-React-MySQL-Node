module.exports = app => {
  app.get("/api/cabinets", (req, res, next) => {
    let sql = "select * from cabinets order by cabinet_name ASC";
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

  app.post("/api/cabinets", function (req, res, next) {

    let data = {
      cabinet_name: req.body.cabinet_name,
      cabinet_desc: req.body.cabinet_desc,
      cabinet_supplier: req.body.cabinet_supplier,
      lead_time: req.body.lead_time,
      cabinet_stock: req.body.cabinet_stock
    }

    let sql = "insert into cabinets (cabinet_name, cabinet_desc, cabinet_supplier, lead_time, cabinet_stock) values ('"+ data.cabinet_name +"', '"+ data.cabinet_desc +"', '"+ data.cabinet_supplier +"', '"+ data.lead_time +"', '"+ data.cabinet_stock +"')";

    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          let sql1 = "select * from cabinets where cabinet_name = '" + data.cabinet_name + "'";
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

  app.delete("/api/cabinets/:id", function (req, res, next) {
    let sql = "DELETE FROM cabinets WHERE id = " + req.params.id;
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

  app.put("/api/cabinets/:id", (req, res, next) => {

    let sql = "update cabinets set cabinet_name = '"+ req.body.cabinet_name +"', cabinet_desc = '"+ req.body.cabinet_desc +"' , cabinet_supplier ='" + req.body.cabinet_supplier + "', lead_time = '"+ req.body.lead_time +"' where id = '"+ req.params.id +"'";

    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          let sql1 = "select * from cabinets where id = '" + req.params.id + "'";
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

  app.put("/api/cabinets/permit/:id", (req, res, next) => {

    let sql = "update cabinets set is_permitted = true where id = '"+ req.params.id +"'";

    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          let sql1 = "select * from cabinets where id = '" + req.params.id + "'";
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
