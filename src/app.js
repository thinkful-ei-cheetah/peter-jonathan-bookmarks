require('dotenv').config()
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const bookmarksRouter = require('./bookmarks/bookmarks');

const auth = require('./auth/auth');
const errorHandler = require('./error/error');
const corsOptions = require('./cors/cors');

const { NODE_ENV } = require('./config');

const app = express();

const morganOption = process.env.NODE_ENV === 'production' ? 'tiny' : 'common';

app.use(morgan(morganOption));
app.use(cors(corsOptions));
app.use(helmet());

app.use(auth);
app.use(bookmarksRouter);

app.use(errorHandler);
  

module.exports = app;
