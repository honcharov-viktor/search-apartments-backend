
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');

const clientRoutes = require('./routes/client');
const adminRoutes = require('./routes/admin');
const { devErrorHandler } = require('./middlewares/errorHeandler');

const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '10Mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('dev'));

app.use('/api', clientRoutes);
app.use('/api', adminRoutes);

app.use(devErrorHandler);

module.exports = app;
