const config = {
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
        plz: "10115" // Berlin Mitte
      }
    }
  ]
};

/** ************* DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {
  module.exports = config;
}
