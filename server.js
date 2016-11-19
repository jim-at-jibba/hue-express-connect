'use strict';

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const util = require('./util/general');
const morgan = require('morgan');
const logger = require('./util/logger');
const settings = require('./config.json');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use('/api', require('./routes'));

const server = app.listen(settings.settings.port, function () {
  logger.info(`Server running at http://127.0.0.1:${settings.settings.port}/`);
});

server.on('error', function(e) {
  logger.error( `Warning: ${e}` );
});