
const Log = require("logger");
const NodeHelper = require("node_helper");
const Aponet = require("./lib/aponet");

module.exports = NodeHelper.create({
  start () {
    Log.log(`Starting module helper: ${this.name}`);
    this.updateInterval = null;
    this.requestInProgress = false;
  },

  stop () {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
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
        () => this.getData(this.config),
        this.config.updateInterval
      );
    }
  },

  async fetchAponetData (config, day) {
    const searchPage = await fetch("https://www.aponet.de/notdienstsuche", {
      headers: {"user-agent": "Mozilla/5.0"}
    });
    if (!searchPage.ok) {
      throw new Error(`HTTP error while loading search page! status: ${searchPage.status}`);
    }

    const page = await searchPage.text();
    const action = Aponet.getSearchAction(page);
    if (!action) {
      throw new Error("Aponet search form not found");
    }

    const form = Aponet.createSearchForm(page, config, day);
    const cookies = Aponet.getCookies(searchPage.headers);
    const response = await fetch(new URL(action.replaceAll("&amp;", "&"), "https://www.aponet.de"), {
      method: "POST",
      headers: {
        "content-type": "application/x-www-form-urlencoded",
        cookie: cookies,
        referer: "https://www.aponet.de/notdienstsuche",
        "user-agent": "Mozilla/5.0"
      },
      body: form
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return Aponet.parseResults(await response.text());
  },

  async getData (config) {
    if (this.requestInProgress) {
      Log.debug("Skipping pharmacy update because a request is already running");
      return;
    }
    this.requestInProgress = true;

    const currentDate = new Date();
    let searchDate = currentDate;
    if (config.day !== "today") {
      searchDate = new Date(currentDate.getTime() + 24 * 60 * 60 * 1000);
    }
    const apiDate = Aponet.formatApiDate(searchDate);

    Log.debug(`Fetching pharmacy data from Aponet for ${config.plz} on ${apiDate}`);
    try {
      const apotheken = await this.fetchAponetData(config, apiDate);
      this.sendSocketNotification("APO_DATA_RECEIVED", apotheken);
    } catch (error) {
      Log.error(error);
      this.sendSocketNotification("FETCH_ERROR", error.message || "Unbekannter Fehler");
    } finally {
      this.requestInProgress = false;
    }
  }
});
