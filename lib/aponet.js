const formatApiDate = (date) => `${date.getFullYear()}-${(date.getMonth() + 1).toString()
  .padStart(2, "0")}-${date.getDate().toString()
  .padStart(2, "0")}`;

const decodeHtml = (value) => value
  .replaceAll("&nbsp;", " ")
  .replaceAll("&amp;", "&")
  .replaceAll("&quot;", "\"")
  .replaceAll("&#039;", "'")
  .replaceAll(/<[^>]+>/gu, "")
  .replaceAll(/\s+/gu, " ")
  .trim();

const getElementValue = (html, className) => {
  const match = html.match(new RegExp(`<[^>]+class="[^"]*\\b${className}\\b[^"]*"[^>]*>(?<value>[\\s\\S]*?)<\\/[^>]+>`, "u"));
  if (!match) {
    return "";
  }
  return decodeHtml(match.groups.value);
};

const getPhoneValue = (html) => {
  const match = html.match(/href="tel:[^"]*"[^>]*>(?<value>[\s\S]*?)<\/a>/u);
  if (!match) {
    return "";
  }
  return decodeHtml(match.groups.value);
};

const parseResults = (html) => {
  const entries = html.match(/<li class="list-group-item"[\s\S]*?<\/li>/gu) || [];
  return entries.map((entry) => {
    const duty = getElementValue(entry, "mb-2")
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
      name: getElementValue(entry, "name"),
      distanz: distanceValue,
      startdatum: startDate,
      startzeit: startTime,
      enddatum: endDate,
      endzeit: endTime,
      strasse: getElementValue(entry, "strasse"),
      plz: getElementValue(entry, "plz"),
      ort: getElementValue(entry, "ort"),
      telefon: getPhoneValue(entry)
    };
  });
};

const getSearchAction = (page) => page.match(/<form[^>]+id="pharmacy-searchform"[^>]+action="(?<value>[^"]+)"/su)?.groups.value;

const createSearchForm = (page, config, day) => {
  const form = new URLSearchParams();
  for (const match of page.matchAll(/<input[^>]+type="hidden"[^>]+name="(?<name>[^"]+)"[^>]+value="(?<value>[^"]*)"/gu)) {
    form.set(match.groups.name, match.groups.value.replaceAll("&quot;", "\""));
  }
  form.set("tx_aponetpharmacy_search[search][plzort]", config.plz);
  form.set("tx_aponetpharmacy_search[search][date]", day);
  form.set("tx_aponetpharmacy_search[search][street]", "");
  form.set("tx_aponetpharmacy_search[search][radius]", config.radius);
  return form;
};

const getCookies = (headers) => {
  let setCookies = [];
  if (typeof headers.getSetCookie === "function") {
    setCookies = headers.getSetCookie();
  } else {
    const cookieHeader = headers.get("set-cookie");
    if (cookieHeader) {
      setCookies = [cookieHeader];
    }
  }
  return setCookies.map((cookie) => cookie.split(";", 1)[0]).join("; ");
};

module.exports = {
  createSearchForm,
  formatApiDate,
  getCookies,
  getSearchAction,
  parseResults
};
