
const Log = require("logger");
const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
  start () {
    Log.log(`Starting module helper: ${this.name}`);
    this.updateInterval = null;
  },

  socketNotificationReceived (notification, payload) {
    if (notification === "GET_APO_DATA") {
      this.config = payload;
      Log.log("MMM-ApothekenNotdienst node_helper received a socket notification");

      // Clear existing interval to prevent memory leak
      if (this.updateInterval) {
        clearInterval(this.updateInterval);
      }

      this.getData(payload);
      this.updateInterval = setInterval(
        () => this.getData(payload),
        this.config.updateInterval
      );
    }
  },

  formatDate (date) {
    return `${date.getDate().toString()
      .padStart(2, "0")}.${(date.getMonth() + 1).toString().padStart(2, "0")}.${date.getFullYear()}`;
  },

  buildApiUrl (config, day) {
    const url = new URL("https://www.aponet.de/notdienstsuche");
    url.search = new URLSearchParams({
      "tx_aponetpharmacy_search[action]": "result",
      "tx_aponetpharmacy_search[controller]": "Search",
      "tx_aponetpharmacy_search[search][plzort]": "",
      "tx_aponetpharmacy_search[search][date]": day,
      "tx_aponetpharmacy_search[search][street]": "",
      "tx_aponetpharmacy_search[search][radius]": config.radius,
      "tx_aponetpharmacy_search[search][lat]": config.lat,
      "tx_aponetpharmacy_search[search][lng]": config.lon,
      "tx_aponetpharmacy_search[token]": "216823d96ea25c051509d935955c130fbc72680fc1d3040fe3e8ca0e25f9cd02",
      type: "1981"
    }).toString();
    return url;
  },

  async getData (config) {
    const currentDate = new Date();
    const today = this.formatDate(currentDate);
    const tomorrowDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    const tomorrow = this.formatDate(tomorrowDate);
    let day = tomorrow;
    if (config.day === "today") {
      day = today;
    }
    const url = this.buildApiUrl(config, day);

    Log.debug(`Fetching data from ${url}`);
    try {
      const response = await fetch(url);

      if (!response.ok) {
        Log.error(`HTTP error! status: ${response.status}`);
        return;
      }

      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const text = await response.text();
        Log.error(`Expected JSON but received: ${contentType}`);
        Log.error(`Response preview: ${text.substring(0, 200)}`);
        return;
      }

      const data = await response.json();
      const apotheken = data?.results?.apotheken?.apotheke || [];

      this.sendSocketNotification("APO_DATA_RECEIVED", apotheken);
    } catch (error) {
      Log.error(error);
    }
  }
});
