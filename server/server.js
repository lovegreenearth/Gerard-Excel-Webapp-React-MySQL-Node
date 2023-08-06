const express = require("express");
const historyApiFallback = require("connect-history-api-fallback");

const mysql = require('mysql');

const path = require("path");
const webpack = require("webpack");
const webpackDevMiddleware = require("webpack-dev-middleware");
const webpackHotMiddleware = require("webpack-hot-middleware");

const config = require("../config/config");
const webpackConfig = require("../webpack.config");

const isDev = process.env.NODE_ENV !== "production";
const port = process.env.PORT || 8000;

// Configuration
// ================================================================================================

const mysqlConnection = mysql.createConnection({
	host     : "127.0.0.1",
	user     : "root1",
	password : "a5PW3$%3qcz",
	database : "azco"
});

mysqlConnection.connect((err)=>{
	if(err) throw err;
	console.log('DataBase: connect success ...');
});

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(function(req, res, next){
	res.locals.connection = mysqlConnection;
	next();
});

// API routes
require("./routes")(app);

if (isDev) {
  const compiler = webpack(webpackConfig);

  app.use(
    historyApiFallback({
      verbose: false
    })
  );

  app.use(
    webpackDevMiddleware(compiler, {
      publicPath: webpackConfig.output.publicPath,
      contentBase: path.resolve(__dirname, "../client/public"),
      stats: {
        colors: true,
        hash: false,
        timings: true,
        chunks: false,
        chunkModules: false,
        modules: false
      }
    })
  );

  app.use(webpackHotMiddleware(compiler));
  app.use(express.static(path.resolve(__dirname, "../dist")));
} else {
  app.use(express.static(path.resolve(__dirname, "../dist")));
  app.get("*", function (req, res) {
    res.sendFile(path.resolve(__dirname, "../dist/index.html"));
    res.end();
  });
}

app.listen(port, "localhost", err => {
  if (err) {
    console.log(err);
  }

  console.info(">>> 🌎 Open http://localhost:%s/ in your browser.", port);
});

module.exports = app;
