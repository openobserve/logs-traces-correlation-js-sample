const { pipeline } = require("node:stream");
const build = require("pino-abstract-transport");
const { default: OpenobserveTransport } = require("./pino-o2.js");

module.exports = async function (options) {
  return build(
    function (source) {
      const myTransportStream = new OpenobserveTransport({
        url: "https://alpha1.dev.zinclabs.dev/",
        organization: "default",
        streamName: "logs_traces_correlation",
        auth: {
          username: "",
          password: "",
        },
      });
      console.log(JSON.stringify(source), "source----");
      
      pipeline(source, myTransportStream, (err) => {
        console.log(err, "Err");
        
      });
      return myTransportStream;
    },
    {
      // This is needed to be able to pipeline transports.
      enablePipelining: true,
    }
  );
};
