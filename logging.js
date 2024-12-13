const pino = require('pino');
const { trace, context } = require('@opentelemetry/api');
const OpenobserveTransport = require('@openobserve/pino-openobserve');

const logger = pino({
  level: 'info',
  formatters: {
    log: (object) => {
      const spanContext = trace.getSpan(context.active());
      if (spanContext) {
        object.traceId = spanContext.spanContext().traceId;
        object.spanId = spanContext.spanContext().spanId;
      } else {
        object.traceId = 'no-trace-id';
        object.spanId = 'no-span-id';
      }
      return object;
    },
  },
  transport: {
    target: OpenobserveTransport,
    options: {
      url: 'https://alpha1.dev.zinclabs.dev/',
      organization: 'default',
      streamName: 'logs_traces_correlation',
      auth: {
        username: 'omkar@openobserve.ai',
        password: 'psKcmw4NRv6uiT0s',
      },
    },
  },
});
// Export the logger
module.exports = { logger };