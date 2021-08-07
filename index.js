require('dotenv').config();

const port = process.env.HTTP_PORT_NO;

const express = require('express')
const app = express()
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const path = require('path')
const moment = require('moment')

morgan.token('moment', function (req) {
  return moment().format('YYYY-MM-DD HH:mm:ss.SSS');
})

const routes = require('./routes');

// create a rolling file logger based on date/time that fires process events
const opts = {
    // errorEventName:'error',
    logDirectory: path.join(__dirname, 'public', 'logs'), // NOTE: folder must exist and be writable...
    fileNamePattern:'application-<DATE>.log',
    dateFormat:'YYYY-MM-DD',
    timestampFormat:'YYYY-MM-DD HH:mm:ss.SSS'
};
const applogger = require('simple-node-logger').createRollingFileLogger( opts );
app.set('applogger',applogger);

applogger.error('hi')

// create a rotating write stream
var accessLogStream = rfs.createStream('access.log', {
    interval: '1d', // rotate daily
    path: path.join(__dirname, 'public', 'logs')
})

// setup the logger
app.use(morgan(':moment :remote-addr :remote-user :method :url :status :res[content-length] - :response-time ms', {
    stream: accessLogStream,
}))

app.use('/',routes);

app.listen(port, '0.0.0.0', () => {
    console.log(`Elements app listening at http://localhost:${port}`)
})