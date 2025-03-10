// lib/monitoring.js
const client = require('prom-client');
const collectDefaultMetrics = client.collectDefaultMetrics;

collectDefaultMetrics({ timeout: 5000 });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.1, 0.3, 0.5, 0.7, 1, 3, 5, 10]
});

const customMetrics = {
  activeUsers: new client.Gauge({
    name: 'active_users',
    help: 'Current number of active users'
  }),
  databaseQueryDuration: new client.Summary({
    name: 'db_query_duration_seconds',
    help: 'Database query execution time'
  })
};

const metricsMiddleware = (req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ 
      method: req.method, 
      route: req.route.path, 
      status_code: res.statusCode 
    });
  });
  next();
};

module.exports = { client, metricsMiddleware, customMetrics };