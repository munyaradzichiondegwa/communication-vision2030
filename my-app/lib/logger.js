// lib/logger.js
const winston = require('winston');
const { Logtail } = require('@logtail/node');
const { combine, timestamp, json, errors } = winston.format;

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: combine(
    errors({ stack: true }),
    timestamp(),
    json()
  ),
  transports: [
    new winston.transports.File({ filename: 'logs/combined.log' }),
    new winston.transports.File({ 
      filename: 'logs/error.log', 
      level: 'error',
      handleRejections: true
    }),
    new winston.transports.Console({
      format: winston.format.simple()
    })
  ]
});

// Optional cloud logging (Logtail example)
if(process.env.LOGTAIL_TOKEN) {
  logger.add(new LogtailTransport(new Logtail(process.env.LOGTAIL_TOKEN)));
}

// Morgan middleware for HTTP logging
const morganMiddleware = require('morgan')(':method :url :status :res[content-length] - :response-time ms', {
  stream: { write: (message) => logger.http(message.trim()) }
});

module.exports = { logger, morganMiddleware };