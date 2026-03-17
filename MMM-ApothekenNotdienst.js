Module.register("MMM-ApothekenNotdienst", {

  defaults: {
    day: "today", // "today" or "tomorrow"
    plz: "", // required: postal code or city name (e.g. "10115" or "Berlin")
    radius: 5, // in km
    maxEntries: 5,
    updateInterval: 30 * 60 * 1000, // update every 30 minutes
    apiToken: "216823d96ea25c051509d935955c130fbc72680fc1d3040fe3e8ca0e25f9cd02" // aponet.de API token
  },

  async start () {
    Log.info(`Starting module: ${this.name} with identifier: ${this.identifier}`);
    this.apotheken = [];
    this.loaded = false;
    this.error = null;

    if (!this.config.plz) {
      Log.error("[MMM-ApothekenNotdienst] No PLZ or city configured. Please set the 'plz' option.");
      this.error = this.translate("CONFIG_MISSING_PLZ");
      this.loaded = true;
      return;
    }

    if (this.config.updateInterval < 20 * 60 * 1000) {
      Log.info("[MMM-ApothekenNotdienst] Request interval is too low. Setting it to 20 minutes.");
      this.config.updateInterval = 20 * 60 * 1000;
    }

    await this.sendSocketNotification("GET_APO_DATA", this.config);
  },

  getDom () {
    const wrapper = document.createElement("div");

    if (this.error) {
      wrapper.innerHTML = this.error;
      wrapper.classList.add("dimmed", "light", "small");
      return wrapper;
    }

    if (!this.loaded) {
      wrapper.innerHTML = this.translate("LOADING");
      wrapper.classList.add("dimmed", "light", "small");
      return wrapper;
    }

    if (this.apotheken.length === 0) {
      wrapper.innerHTML = this.translate("NO_ENTRIES");
      wrapper.classList.add("dimmed", "light", "small");
      return wrapper;
    }

    const slicedData = this.apotheken.slice(0, this.config.maxEntries);
    slicedData.forEach((apo) => {
      const apoDiv = this.createApoEntry(apo);
      wrapper.appendChild(apoDiv);
    });

    const footer = document.createElement("div");
    footer.classList.add("apo-footer");
    footer.innerHTML = `${this.translate("DATA_SOURCE")} <b>www.aponet.de</b>`;
    wrapper.appendChild(footer);

    return wrapper;
  },

  createApoEntry (apo) {
    const apoDiv = document.createElement("div");
    apoDiv.classList.add("apo-entry");

    const apoNameDiv = document.createElement("div");
    apoNameDiv.innerHTML = apo.name;
    apoNameDiv.classList.add("apo-name");
    apoDiv.appendChild(apoNameDiv);

    const apoDistancesDiv = document.createElement("div");
    const apoDistance = Math.round(apo.distanz * 10) / 10;
    apoDistancesDiv.innerHTML = this.translate("DISTANCE", {distance: `<b>${apoDistance} km</b>`});
    apoDistancesDiv.classList.add("apo-distance");
    apoDiv.appendChild(apoDistancesDiv);

    const apoTimeDiv = document.createElement("div");
    apoTimeDiv.innerHTML = this.translate("ON_DUTY", {
      startdate: `<b>${apo.startdatum}</b>`,
      starttime: `<b>${apo.startzeit}</b>`,
      enddate: `<b>${apo.enddatum}</b>`,
      endtime: `<b>${apo.endzeit}</b>`
    });
    apoTimeDiv.classList.add("apo-time");
    apoDiv.appendChild(apoTimeDiv);

    const apoAddressDiv = document.createElement("div");
    apoAddressDiv.innerHTML = `${apo.strasse}, ${apo.plz} ${apo.ort}`;
    apoAddressDiv.classList.add("apo-address");
    apoDiv.appendChild(apoAddressDiv);

    const apoPhoneDiv = document.createElement("div");
    apoPhoneDiv.innerHTML = apo.telefon;
    apoPhoneDiv.classList.add("apo-phone");
    apoDiv.appendChild(apoPhoneDiv);

    return apoDiv;
  },

  getStyles () {
    return ["MMM-ApothekenNotdienst.css"];
  },

  getTranslations () {
    return {
      de: "translations/de.json",
      en: "translations/en.json"
    };
  },

  socketNotificationReceived (notification, payload) {
    if (notification === "APO_DATA_RECEIVED") {
      this.loaded = true;
      this.error = null;
      this.apotheken = payload || [];
      this.updateDom();
    } else if (notification === "FETCH_ERROR") {
      this.loaded = true;
      this.error = payload || this.translate("UNKNOWN_ERROR");
      this.updateDom();
    }
  }
});
