require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const winston = require('winston');
const helmet = require('helmet');

const auth = require('./auth/auth');
const errorHandler = require('./error/error');
const corsOptions = require('./cors/cors');

const { NODE_ENV } = require('./config');

const app = express();

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'info.log' })
  ]
});

if (NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple()
  }));
}

const morganOption = (NODE_ENV === 'production') ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(cors(corsOptions));
app.use(helmet());

app.use(auth);

app.use(errorHandler);
  

module.exports = app;
