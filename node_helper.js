
const Log = require("logger");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start () {
    Log.log(`Starting module helper: ${this.name}`);
  },

  socketNotificationReceived (notification, payload) {
    if (notification === "GET_APO_DATA") {
      this.config = payload;
      Log.log("MMM-ApothekenNotdienst node_helper received a socket notification");
      this.getData(payload);
      const self = this;
      setInterval(
        () => {
          self.getData(payload);
        },
        this.config.updateInterval
      );
    }
  },

  async getData (config) {
    const currentDate = new Date();

    const today = `${currentDate.getDate().toString()
      .padStart(2, "0")}.${(currentDate.getMonth() + 1).toString().padStart(2, "0")}.${currentDate.getFullYear()}`;

    const tomorrowDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const tomorrow = `${tomorrowDate.getDate().toString()
      .padStart(2, "0")}.${(tomorrowDate.getMonth() + 1).toString().padStart(2, "0")}.${tomorrowDate.getFullYear()}`;

    let day = tomorrow;

    if (config.day === "today") {
      day = today;
    }
    const url = new URL("https://www.aponet.de/apotheke/notdienstsuche");
    url.search = new URLSearchParams({
      "tx_aponetpharmacy_search[action]": "result",
      "tx_aponetpharmacy_search[controller]": "Search",
      "tx_aponetpharmacy_search[search][plzort]": "",
      "tx_aponetpharmacy_search[search][date]": day,
      "tx_aponetpharmacy_search[search][street]": "",
      "tx_aponetpharmacy_search[search][radius]": config.radius,
      "tx_aponetpharmacy_search[search][lat]": config.lat,
      "tx_aponetpharmacy_search[search][lng]": config.lon,
      "tx_aponetpharmacy_search[token]": "216823d96ea25c051509d935955c130fbc72680fc1d3040fe3f8ca0e25f9cd02",
      type: "1981"
    }).toString();

    Log.debug(`Fetching data from ${url}`);
    try {
      const response = await fetch(url);

      const data = await response.json();
      const apotheken = data?.results?.apotheken?.apotheke || [];
      // Log.debug(apotheken);

      this.sendSocketNotification("APO_DATA_RECEIVED", apotheken);
    } catch (error) {
      Log.error(error);
    }
  }
});
