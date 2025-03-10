// 1-a. Enhanced Tracing Configuration
const { W3CTraceContextPropagator } = require('@opentelemetry/core');
const { ExpressInstrumentation } = require('@opentelemetry/instrumentation-express');

const tracer = require('./tracing').tracer;

// Custom trace middleware
app.use((req, res, next) => {
  const span = tracer.startSpan('http.request');
  span.setAttribute('http.method', req.method);
  span.setAttribute('http.route', req.path);
  span.setAttribute('user.id', req.user?.id || 'anonymous');
  
  // Propagate trace context to downstream services
  const carrier = {};
  propagator.inject(context.active(), carrier, defaultTextMapSetter);
  req.headers.traceparent = carrier.traceparent;
  
  res.on('finish', () => {
    span.setStatus({ code: res.statusCode < 400 ? 1 : 2 });
    span.end();
  });
  next();
});

// 1-b. Alerting Integration
const alertManager = require('./alerting');

// Custom alert trigger
app.use((err, req, res, next) => {
  alertManager.triggerAlert('HTTP_ERROR', {
    path: req.path,
    status: res.statusCode,
    userId: req.user?.id,
    traceId: res.locals.traceId
  });
  next(err);
});