
const Log = require("logger");
const NodeHelper = require("node_helper");

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

  formatApiDate (date) {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString()
      .padStart(2, "0")}-${date.getDate().toString()
      .padStart(2, "0")}`;
  },

  decodeHtml (value) {
    return value
      .replaceAll("&nbsp;", " ")
      .replaceAll("&amp;", "&")
      .replaceAll("&quot;", "\"")
      .replaceAll("&#039;", "'")
      .replaceAll(/<[^>]+>/gu, "")
      .replaceAll(/\s+/gu, " ")
      .trim();
  },

  getElementValue (html, className) {
    const match = html.match(new RegExp(`<[^>]+class="[^"]*\\b${className}\\b[^"]*"[^>]*>(?<value>[\\s\\S]*?)<\\/[^>]+>`, "u"));
    if (!match) {
      return "";
    }
    return this.decodeHtml(match.groups.value);
  },

  getPhoneValue (html) {
    const match = html.match(/href="tel:[^"]*"[^>]*>(?<value>[\s\S]*?)<\/a>/u);
    if (!match) {
      return "";
    }
    return this.decodeHtml(match.groups.value);
  },

  parseResults (html) {
    const entries = html.match(/<li class="list-group-item"[\s\S]*?<\/li>/gu) || [];
    return entries.map((entry) => {
      const duty = this.getElementValue(entry, "mb-2")
        .match(/Notdienst vom (?<startDate>\d{2}\.\d{2}\.\d{4}) um (?<startTime>\d{2}:\d{2}) Uhr bis (?<endDate>\d{2}\.\d{2}\.\d{4}) um (?<endTime>\d{2}:\d{2}) Uhr/u);
      const distance = entry.match(/class="[^"]*\bdistanz\b[^"]*"[\s\S]*?(?<value>\d+(?:[,.]\d+)?)\s*km/u);

      let startDate = "";
      let startTime = "";
      let endDate = "";
      let endTime = "";
      if (duty) {
        ({startDate, startTime, endDate, endTime} = duty.groups);
      }
      let distanceValue = 0;
      if (distance) {
        distanceValue = Number.parseFloat(distance.groups.value.replace(",", "."));
      }

      return {
        name: this.getElementValue(entry, "name"),
        distanz: distanceValue,
        startdatum: startDate,
        startzeit: startTime,
        enddatum: endDate,
        endzeit: endTime,
        strasse: this.getElementValue(entry, "strasse"),
        plz: this.getElementValue(entry, "plz"),
        ort: this.getElementValue(entry, "ort"),
        telefon: this.getPhoneValue(entry)
      };
    });
  },

  async fetchAponetData (config, day) {
    const searchPage = await fetch("https://www.aponet.de/notdienstsuche", {
      headers: {"user-agent": "Mozilla/5.0"}
    });
    if (!searchPage.ok) {
      throw new Error(`HTTP error while loading search page! status: ${searchPage.status}`);
    }

    const page = await searchPage.text();
    const action = page.match(/<form[^>]+id="pharmacy-searchform"[^>]+action="(?<value>[^"]+)"/su)?.groups.value;
    if (!action) {
      throw new Error("Aponet search form not found");
    }

    const form = new URLSearchParams();
    for (const match of page.matchAll(/<input[^>]+type="hidden"[^>]+name="(?<name>[^"]+)"[^>]+value="(?<value>[^"]*)"/gu)) {
      form.set(match.groups.name, match.groups.value.replaceAll("&quot;", "\""));
    }
    form.set("tx_aponetpharmacy_search[search][plzort]", config.plz);
    form.set("tx_aponetpharmacy_search[search][date]", day);
    form.set("tx_aponetpharmacy_search[search][street]", "");
    form.set("tx_aponetpharmacy_search[search][radius]", config.radius);

    let setCookies = [];
    if (typeof searchPage.headers.getSetCookie === "function") {
      setCookies = searchPage.headers.getSetCookie();
    } else {
      const cookieHeader = searchPage.headers.get("set-cookie");
      if (cookieHeader) {
        setCookies = [cookieHeader];
      }
    }
    const cookies = setCookies.map((cookie) => cookie.split(";", 1)[0]).join("; ");
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
    return this.parseResults(await response.text());
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
    const apiDate = this.formatApiDate(searchDate);

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
