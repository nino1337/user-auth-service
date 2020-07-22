const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(cors());

app.use(morgan('combined'));

// import environmental variables from our local.env file
require('dotenv').config();

// connect to mongodb
mongoose
  .connect(process.env.DB_HOST, {
    auth: {
      user: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('connected to mongodb '))
  .catch((error) => console.log(`could not connect to mongodb: ${error}`));

app.use(express.json());

// set routes
app.use('/', routes);

const port = parseInt(process.env.PORT, 10);
app.listen(port, () => {
  console.log(`user-auth-service listening on port: ${port}`);
});

module.exports = app;
