/*tracking.js*/
const opentelemetry = require('@opentelemetry/sdk-node');
const {
  getNodeAutoInstrumentations,
} = require('@opentelemetry/auto-instrumentations-node');
const {
  OTLPTraceExporter,
} = require('@opentelemetry/exporter-trace-otlp-proto');
// const {
//   OTLPMetricExporter,
// } = require('@opentelemetry/exporter-metrics-otlp-proto');
// const { PeriodicExportingMetricReader } = require('@opentelemetry/sdk-metrics');

const sdk = new opentelemetry.NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: "https://alpha1.dev.zinclabs.dev/api/default",
    headers: {
      Authorization: "Basic b21rYXJAb3Blbm9ic2VydmUuYWk6cHNLY213NE5SdjZ1aVQwcw==",
      "stream-name": "logs_traces_correlation",
    },
  }),
  // metricReader: new PeriodicExportingMetricReader({
  //   exporter: new OTLPMetricExporter({
  //     url: '<your-otlp-endpoint>/v1/metrics', // url is optional and can be omitted - default is http://localhost:4318/v1/metrics
  //     headers: {}, // an optional object containing custom headers to be sent with each request
  //     concurrencyLimit: 1, // an optional limit on pending requests
  //   }),
  // }),
  instrumentations: [getNodeAutoInstrumentations()],
});
sdk.start();