Module.register("MMM-ApothekenNotdienst", {

  defaults: {
    day: "today", // "today" or "tomorrow"
    lat: 52.4974, // Berlin
    lon: 13.4596,
    radius: 5, // in km
    maxEntries: 5,
    updateInterval: 30 * 60 * 1000 // update every 30 minutes
  },

  async start () {
    Log.info(`Starting module: ${this.name} with identifier: ${this.identifier}`);

    if (this.config.updateInterval < 20 * 60 * 1000) {
      Log.info("[MMM-ApothekenNotdienst] Request interval is too low. Setting it to 20 minutes.");
      this.config.updateInterval = 20 * 60 * 1000;
    }

    await this.sendSocketNotification("GET_APO_DATA", this.config);
  },

  getDom () {
    const wrapper = document.createElement("div");

    if (this.dataDiv) {
      wrapper.appendChild(this.dataDiv);
    }

    return wrapper;
  },

  getStyles () {
    return ["MMM-ApothekenNotdienst.css"];
  },

  socketNotificationReceived (notification, payload) {
    if (notification === "APO_DATA_RECEIVED") {
      if (payload && payload.length > 0) {
        payload = payload.slice(0, this.config.maxEntries);

        this.dataDiv = document.createElement("div");
        payload.forEach((apo) => {
          const apoDiv = document.createElement("div");
          apoDiv.classList.add("apo-entry");

          const apoNameDiv = document.createElement("div");
          apoNameDiv.innerHTML = apo.name;
          apoNameDiv.classList.add("apo-name");
          apoDiv.appendChild(apoNameDiv);

          const apoDistancesDiv = document.createElement("div");
          const apoDistance = Math.round(apo.distanz * 10) / 10;
          apoDistancesDiv.innerHTML = `Entfernung: <b>${apoDistance} km</b>`;
          apoDistancesDiv.classList.add("apo-distance");
          apoDiv.appendChild(apoDistancesDiv);

          const apoTimeDiv = document.createElement("div");
          apoTimeDiv.innerHTML = `Notdienst vom <b>${apo.startdatum}</b> um <b>${apo.startzeit} Uhr</b> bis <b>${apo.enddatum}</b> um <b>${apo.endzeit}</b> Uhr.`;
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

          this.dataDiv.appendChild(apoDiv);
        });
        const footer = document.createElement("div");
        footer.classList.add("apo-footer");
        footer.innerHTML = "Datenquelle: <b>www.aponet.de</b>";
        this.dataDiv.appendChild(footer);

        this.updateDom();
      }
    }
  }
});
