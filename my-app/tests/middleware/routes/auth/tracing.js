// tracing.js
const { NodeTracerProvider } = require('@opentelemetry/sdk-trace-node');
const { SimpleSpanProcessor } = require('@opentelemetry/sdk-trace-base');
const { JaegerExporter } = require('@opentelemetry/exporter-jaeger');
const { Resource } = require('@opentelemetry/resources');
const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');
const { registerInstrumentations } = require('@opentelemetry/instrumentation');
const { HttpInstrumentation } = require('@opentelemetry/instrumentation-http');
const { MongoDBInstrumentation } = require('@opentelemetry/instrumentation-mongodb');

const provider = new NodeTracerProvider({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'your-service',
  }),
});

provider.addSpanProcessor(
  new SimpleSpanProcessor(
    new JaegerExporter({
      endpoint: 'http://jaeger-collector:14268/api/traces',
    })
  )
);

provider.register();

registerInstrumentations({
  instrumentations: [
    new HttpInstrumentation(),
    new MongoDBInstrumentation(),
  ],
});

// Middleware to propagate context
const tracingMiddleware = (req, res, next) => {
  const span = tracer.startSpan('http_request');
  span.setAttribute('http.method', req.method);
  span.setAttribute('http.route', req.path);
  
  // Store traceId in res.locals
  res.locals.traceId = span.spanContext().traceId;
  
  res.on('finish', () => {
    span.setAttribute('http.status_code', res.statusCode);
    span.end();
  });
  next();
};