require('./tracing');  // Initialize tracing
const express = require('express');
const { logger } = require('./logging');
const { trace, context } = require('@opentelemetry/api');

const app = express();
const port = 3002;

app.use(express.json());

// Middleware to add trace information to logs
app.use((req, res, next) => {
  const spanContext = trace.getSpan(context.active())?.spanContext();
  req.traceId = spanContext?.traceId || 'no-trace-id';
  req.spanId = spanContext?.spanId || 'no-span-id';
  next();
});

app.get('/', (req, res) => {
  logger.info({ traceId: req.traceId, spanId: req.spanId }, 'Received request');
  res.send('Hello World!');
});

app.listen(port, () => {
  logger.info({ traceId: 'server-start', spanId: 'server-start' }, `Server is listening at http://localhost:${port}`);
});
