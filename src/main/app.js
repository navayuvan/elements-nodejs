require('dotenv').config();

const express = require('express')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path')
const moment = require('moment')
const simple_node_logger = require('simple-node-logger');
const routes = require('./routes');

const app = express()

// parse incoming json req body
app.use(express.json());

// create a rolling file logger based on date/time that fires process events
const opts = {
    // errorEventName:'error',
    logDirectory: path.join(__dirname, '..', '..', 'public', 'logs'), // NOTE: folder must exist and be writable...
    fileNamePattern:'application-<DATE>.log',
    dateFormat:'YYYY-MM-DD',
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
};
const applogger = simple_node_logger.createRollingFileLogger( opts );
app.set('applogger',applogger);


morgan.token('moment', function (req) {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
});
// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, '..', '..', 'public', 'logs')
});
// setup the logger
app.use(morgan(':moment :remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms', {
    stream: accessLogStream,
}));

app.use('/',routes);

module.exports = app;