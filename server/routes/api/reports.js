module.exports = app => {
  app.get("/api/reports", (req, res, next) => {
    let usersTmp = [];
    let cabinetsTmp = [];
    let unitsTmp = [];

    let sql1 = "select * from cabinets order by cabinet_name ASC";
    res.locals.connection.query(
      sql1, (error, results) => {
        if(error) {
          res.json(null)
        }else{
          cabinetsTmp = results;
        }
    });

    let sql2 = "select * from units order by unit_name ASC";
    res.locals.connection.query(
      sql2, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          unitsTmp = results;
        }
    });

    let sql3 = "select * from users order by username ASC";
    res.locals.connection.query(
      sql3, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          usersTmp = results;
        }
    });

    let sql4 = "select * from reports order by date DESC";
    res.locals.connection.query(
      sql4, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          let data = {
            users: usersTmp,
            cabinets: cabinetsTmp,
            units: unitsTmp,
            reports: results
          }
          res.json(data);
        }
    });
  });

  app.post("/api/reports", function (req, res, next) {
    
    if(req.body.type == "Cabinets"){
      var sql = "";
      
      if(req.body.inout == "Incoming") {
        sql = "update cabinets set cabinet_stock = cabinet_stock + " + Number(req.body.move_stock) + " where id = " + req.body.move_name;
      }
      if(req.body.inout == "Outgoing") {
        sql = "update cabinets set cabinet_stock = cabinet_stock - " + Number(req.body.move_stock) + ", out_stock = out_stock + " + Number(req.body.move_stock) + " where id = " + req.body.move_name;
      }

      let sql1 = "select * from cabinets where id = '"+ req.body.move_name +"' order by cabinet_name ASC";
      res.locals.connection.query(
        sql1, (error, results) => {
          if(error) {
            res.json(null)
          }else{
            if(results.length != 0) {
              let cabinet = results[0];
              if(cabinet.cabinet_stock == 0) {
                let sql = "update cabinets set is_permitted = false where id = " + req.body.move_name;
                res.locals.connection.query(
                  sql, (error, results) => {
                    if(error) {
                      res.json(null)
                    }else{
                      console.log("permit is false.");
                    }
                });
              }
            }
          }
      });

      res.locals.connection.query(
        sql, (error, results) => {
          if(error) {
            console.log(error); 
            res.json(null)
          }else{
            console.log("cabinet change is done.");
          }
      });
    }

    if(req.body.type == "Units"){

      var sql2 = "";
      var sql3 = "";
      if(req.body.inout == "Incoming") {
        sql2 = "update units set unit_stock = unit_stock + " + Number(req.body.move_stock) + " where id = " + req.body.move_name;

        let sql9 = "select * from units where id = " + req.body.move_name;
        res.locals.connection.query(
          sql9, (error, results) => {
            if(error) {
              console.log(error); 
              res.json(null)
            }else{
              let unit = results[0];
              let sql3 = "update cabinets set out_stock = out_stock - " + Number(req.body.move_stock) + " where id = " + unit.cabinet_id;

              res.locals.connection.query(
                sql3, (error, results) => {
                  if(error) {
                    console.log(error); 
                    res.json(null)
                  }else{
                    console.log("cabinet change is again done.1111");
                  }
              });
            }
        });  
      }

      
      if(req.body.inout == "Outgoing") {
        sql2 = "update units set unit_stock = unit_stock - " + Number(req.body.move_stock) + " where id = " + req.body.move_name;
      }

      res.locals.connection.query(
        sql2, (error, results) => {
          if(error) {
            console.log(error); 
            res.json(null)
          }else{
            console.log("unit change is done.2222");
          }
      });
    }

    let data = {
      'type': req.body.type,
      'inout': req.body.inout,
      'move_stock': req.body.move_stock,
      'user_id': req.body.user_id,
      'move_name': req.body.move_name
    }

    let sql5 = "insert into reports (`type`, `inout`, `move_stock`, `user_id`, `move_name`) values ('"+data.type+"', '"+data.inout+"', '"+data.move_stock+"', '"+Number(data.user_id)+"', '"+data.move_name+"')";

    res.locals.connection.query(
      sql5, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          res.status(201);
          res.json(results)
        }
    });
  });

  app.put("/api/reports/:id", (req, res, next) => {
    var afterStock = req.body.move_stock;
    var beforeStock = req.body.editMove_stock;
    var sql = "";
    if(req.body.type == "Cabinets") {
      if(req.body.inout == 'Incoming') {
        sql = "update cabinets set cabinet_stock = cabinet_stock - " + Number(beforeStock - afterStock) + " where id = " + req.body.product_id;
      }else{
        if((beforeStock - afterStock) > 0) {
          sql = "update cabinets set out_stock = out_stock - " + Number(beforeStock - afterStock) + " where id = " + req.body.product_id;
        }else{
          sql = "update cabinets set out_stock = out_stock - " + Number(beforeStock - afterStock) + ", cabinet_stock = cabinet_stock + " + Number(beforeStock - afterStock) + " where id = " + req.body.product_id;
        }
      }

      res.locals.connection.query(
        sql, (error, results) => {
          if(error) {
            console.log(error); 
            res.json(null)
          }else{
            console.log("cabinet change is done.");
          }
      });

      let sql1 = "select * from cabinets where id = '"+ req.body.product_id +"' order by cabinet_name ASC";

      res.locals.connection.query(
        sql1, (error, results) => {
          if(error) {
            res.json(null)
          }else{
            if(results.length != 0) {
              let cabinet = results[0];
              if(cabinet.cabinet_stock == 0) {
                let sql2 = "update cabinets set is_permitted = false where id = " + req.body.move_name;
                res.locals.connection.query(
                  sql2, (error, results) => {
                    if(error) {
                      res.json(null)
                    }else{
                      console.log("permit is false.");
                    }
                });
              }
            }
          }
      }); 
    }else{

      let sql3 = "";
      let space = beforeStock - afterStock;

      if(req.body.inout == "Incoming") {
        if(space < 0) {

        }else{
          sql3 = "update units set unit_stock = unit_stock - " + Number(space) + " where id = " + req.body.product_id;
          res.locals.connection.query(
            sql3, (error, results) => {
              if(error) {
                console.log(error); 
                res.json(null)
              }else{
                console.log("unit change is done.");
              }
          });
        }
      }else{
        sql3 = "update units set unit_stock = unit_stock + " + Number(space) + " where id = " + req.body.product_id;
        res.locals.connection.query(
          sql3, (error, results) => {
            if(error) {
              console.log(error); 
              res.json(null)
            }else{
              console.log("unit change is done.");
            }
        });
      }
    }

    let sql4 = "update reports set move_stock = " + Number(req.body.move_stock) + " where id = " + req.params.id;

    res.locals.connection.query(
      sql4, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          let sql7 = "select * from reports where id = " + req.params.id;

          res.locals.connection.query(sql7, (error, results) => {
            if(error) {

            }else{
              res.status(201);
              res.json(results[0]);
            }
          });
        }
    });
  });
};
