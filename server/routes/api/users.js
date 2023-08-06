const jwt = require('jsonwebtoken');
const jwtDecode = require('jwt-decode');

module.exports = app => {
  app.get("/api/users", (req, res, next) => {
    let sql = "select * from users order by username ASC";
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

  app.put("/api/resetPassword", (req, res, next) => {

    let sql = "update users set password = '"+ req.body.new_password +"' where role = 'SuperAdmin'";
    res.locals.connection.query(
      sql, (error, results) =>{
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          res.send(JSON.stringify(results));
        }          
    });
  });

  app.post("/api/login", function (req, res, next) {
    var token;
    var decodedToken;

    let sql = "select * from users where username = '" + req.body.username + "' and password = '" + req.body.password + "'";
    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          if(results.length != 0) {
            let user = results[0];
            token = jwt.sign({ username: user.username }, 'azco', {expiresIn: '600000'});
            decodedToken = jwtDecode(token);
            res.status(201);
            res.json({
                'token': token,
                'decodedToken': decodedToken,
                'role' : user.role,
                'user_id' : user.id
            });
          }else{
            res.status(404);
            res.json(null)
          }
        }
    });
  });

  app.post("/api/users", function (req, res, next) {

    let sql = "insert into users (username, password, role, email) values ('"+ req.body.username +"', '"+ req.body.password +"', '"+ req.body.role +"', '"+ req.body.email +"')";

    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          let sql1 = "select * from users where username = '" + req.body.username + "' and password = '" + req.body.password + "'";
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

  app.delete("/api/users/:id", function (req, res, next) {

    let sql = "DELETE FROM users WHERE id = " + req.params.id;
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

  app.put("/api/users/:id", (req, res, next) => {

    let sql = "update users set username = '"+ req.body.username +"', password = '"+ req.body.password +"' , role ='" + req.body.role + "', email = '"+ req.body.email +"' where id = '"+ req.params.id +"'";

    res.locals.connection.query(
      sql, (error, results) => {
        if(error) {
          console.log(error); 
          res.json(null)
        }else{
          let sql1 = "select * from users where id = '" + req.params.id + "'";
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
