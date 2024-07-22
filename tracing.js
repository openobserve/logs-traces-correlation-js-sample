/* tracing.js */
const opentelemetry = require("@opentelemetry/sdk-node");
const {
  getNodeAutoInstrumentations,
} = require("@opentelemetry/auto-instrumentations-node");
const { diag, DiagConsoleLogger, DiagLogLevel } = require("@opentelemetry/api");
const {
  ConsoleSpanExporter,
  BatchSpanProcessor
} = require("@opentelemetry/sdk-trace-base");
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http');

const { Resource } = require("@opentelemetry/resources");
const { SemanticResourceAttributes } = require("@opentelemetry/semantic-conventions");

// For troubleshooting, set the log level to DiagLogLevel.INFO
diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const traceExporter = new OTLPTraceExporter({
  url: "http://localhost:5080/api/logs_traces_correlation/traces",
  headers: {
    Authorization: "",
    "stream-name": "logs_traces_correlation",
  },
  concurrentExports: 10,  // Increase this to handle more concurrent requests
});

const sdk = new opentelemetry.NodeSDK({
  traceExporter,
  instrumentations: [getNodeAutoInstrumentations()],
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: "nodejs-javascript-service",
  }),
  spanProcessor: new BatchSpanProcessor(traceExporter), // Ensure you are using the SimpleSpanProcessor
});

// Start the SDK
sdk.start()

module.exports = sdk;