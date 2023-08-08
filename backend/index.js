/* This is importing the modules that we need to use in our application. */
const express = require('express');
require('./module/checkVersion');

const helmet = require('helmet');
const cors = require('cors'); //  A middleware that is used to parse the body of the request.
const https = require('https');
const fs = require('fs');
const errorHandlers = require('./handlers/errorHandlers');

const session = require('express-session');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
require('dotenv').config();
const crypto = require('crypto');
const nonce = crypto.randomBytes(16).toString('hex'); //#endregion

// create our Express app
const app = express();

//  app.use(helmet.noCache()); // noCache disabled by default
const SERVERPORT = process.env.SERVERPORT || 4000;
const SESSION_SECRET = process.env.SESSION_SECRET;
const sixtyDaysInSeconds = 5184000; // 60 * 24 * 60 * 60

// ======== *** SECURITY MIDDLEWARE ***

app.use(
  cors({
    credentials: true,
    origin: true,
  }),
);

// app middleware
app.use(
  express.urlencoded({
    extended: true,
  }),
);

app.use(express.json());
/* This is a middleware that is used to parse the body of the request. */
const corsOptions = {
  origin: [process.env.ORIGIN_FRONTEND_SERVER], //frontend server localhost:8080
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true, // enable set cookie
  optionsSuccessStatus: 200,
  credentials: true,
};

app.use(cors(corsOptions));

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  }),
);
app.use(cookieParser(SESSION_SECRET)); // any string ex: 'keyboard cat'

// Routers
const authRouter = require('./routes/auth');
const maingroupRouter = require('./routes/maingroup');
const subgroupRouter = require('./routes/subgroup');
const productRouter = require('./routes/products');
app.use('/auth', authRouter);
app.use('/maingroup', maingroupRouter);
app.use('/subgroup', subgroupRouter);
app.use('/products', productRouter);

app.get('/', (req, res, next) => {
  if (req.user) {
    res.status(200).send({
      loggedIn: true,
      user: req.user,
    });
  } else {
    res.status(200).send({
      loggedIn: false,
    });
  }
});

app.use(errorHandlers.notFound);

// Otherwise this was a really bad error we didn't expect! Shoot eh
if (app.get('env') === 'development') {
  /* Development Error Handler - Prints stack trace */
  app.use(errorHandlers.developmentErrors);
}

// production error handler
app.use(errorHandlers.productionErrors);

/* This is telling the server to listen to port 3001. */
app.listen(3001, (err) => {
  if (err) {
    console.log("Error----------", err);
    throw err;
  } else {
    console.log('Server running in the', 3001);
  }
});
