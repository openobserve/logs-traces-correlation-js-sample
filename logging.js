const pino = require("pino");
const pinoOpenObserve = require('@openobserve/pino-openobserve')
const { trace, context } = require('@opentelemetry/api');

const logger = pino({
  level: "info",
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
    }
},
  new pinoOpenObserve({
    url: "",
    organization: "logs_traces_correlation",
    auth: {
      username: "",
      password: "",
    },
    streamName: "logs_traces_correlation",
    batchSize: 1,
    timeThreshold: 15 * 1000
  }),
);

// Export the logger
module.exports = { logger };