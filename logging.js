const pino = require("pino");
const { trace, context } = require("@opentelemetry/api");

const logger = pino({
  level: "info",
  formatters: {
    log: (object) => {
      console.log(object, "OBJECT----");

      const spanContext = trace.getSpan(context.active());
      if (spanContext) {
        object.traceId = spanContext.spanContext().traceId;
        object.spanId = spanContext.spanContext().spanId;
      } else {
        object.traceId = "no-trace-id";
        object.spanId = "no-span-id";
      }
      return object;
    },
  },
  transport: {
    target: "./my-transform.js",
    options: {
      url: "https://alpha1.dev.zinclabs.dev/",
      organization: "default",
      streamName: "logs_traces_correlation",
      auth: {
        username: "",
        password: "",
      },
    },
  },
});
// Export the logger
module.exports = { logger };
