let config = {
  address: "0.0.0.0",
  ipWhitelist: [],
  logLevel: ["INFO", "LOG", "WARN", "ERROR", "DEBUG"],
  modules: [
    {
      module: "clock",
      position: "middle_center"
    },
    {
      module: "MMM-ApothekenNotdienst",
      header: "Apotheken-Notdienste",
      position: "top_left",
      config: {
        lat: 52.4974,
        lon: 13.4596
      }
    }
  ]
};

/** ************* DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
