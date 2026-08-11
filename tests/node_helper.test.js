const assert = require("node:assert/strict");
const {after, describe, it, mock} = require("node:test");
const Module = require("node:module");

const loggerMock = {
  debug: mock.fn(),
  error: mock.fn(),
  log: mock.fn()
};

/* eslint-disable no-underscore-dangle */
const originalLoad = Module._load.bind(Module);
Module._load = (request, parent, isMain) => {
  if (request === "logger") {
    return loggerMock;
  }
  if (request === "node_helper") {
    return {create: (helper) => helper};
  }
  return originalLoad(request, parent, isMain);
};

const helper = require("../node_helper");
const Aponet = require("../lib/aponet");
Module._load = originalLoad;
/* eslint-enable no-underscore-dangle */

after(() => {
  mock.restoreAll();
});

const createResponse = (body, status = 200, headers = {}) => ({
  headers,
  ok: status >= 200 && status < 300,
  status,
  text: () => Promise.resolve(body)
});

const resultHtml = `
  <li class="list-group-item">
    <h2 class="name">Test Apotheke</h2>
    <div class="distanz badge badge-light">
      <span>Entfernung: </span>2,79 km
    </div>
    <div class="mb-2">
      <p>Notdienst vom 11.08.2026 um 09:00 Uhr bis 12.08.2026 um 09:00 Uhr.</p>
    </div>
    <span class="strasse">Teststraße 1</span>
    <span class="plz">10115</span>
    <span class="ort">Berlin</span>
    <span>Tel: </span><a href="tel:+49 30 123456">+49 30 123456</a>
  </li>
`;

describe("parseResults", () => {
  it("parses pharmacy details from Aponet HTML", () => {
    const [pharmacy] = Aponet.parseResults(resultHtml);

    assert.deepEqual(pharmacy, {
      name: "Test Apotheke",
      distanz: 2.79,
      startdatum: "11.08.2026",
      startzeit: "09:00",
      enddatum: "12.08.2026",
      endzeit: "09:00",
      strasse: "Teststraße 1",
      plz: "10115",
      ort: "Berlin",
      telefon: "+49 30 123456"
    });
  });

  it("returns an empty array when Aponet has no results", () => {
    assert.deepEqual(Aponet.parseResults("<div id=\"pharmacy-search-result\"></div>"), []);
  });
});

describe("Aponet request helpers", () => {
  it("formats dates for the Aponet form", () => {
    assert.equal(Aponet.formatApiDate(new Date(2026, 7, 11)), "2026-08-11");
  });

  it("builds the search form from the page fields", () => {
    const form = Aponet.createSearchForm(
      "<input type=\"hidden\" name=\"trusted\" value=\"yes\">",
      {plz: "10115", radius: 5},
      "2026-08-11"
    );

    assert.equal(form.get("trusted"), "yes");
    assert.equal(form.get("tx_aponetpharmacy_search[search][plzort]"), "10115");
    assert.equal(form.get("tx_aponetpharmacy_search[search][date]"), "2026-08-11");
  });

  it("returns no action when the search form is missing", () => {
    assert.ok(!Aponet.getSearchAction("<form></form>"));
  });

  it("supports the cookie header fallback", () => {
    const headers = {get: () => "PHPSESSID=fallback; Path=/"};

    assert.equal(Aponet.getCookies(headers), "PHPSESSID=fallback");
  });
});

describe("fetchAponetData", () => {
  it("loads the form and submits the search with its session cookie", async () => {
    const calls = [];
    mock.method(globalThis, "fetch", (url, options) => {
      calls.push({options, url});
      if (calls.length === 1) {
        return createResponse(
          `<form id="pharmacy-searchform" action="/notdienstsuche?cHash=test">
            <input type="hidden" name="tx_aponetpharmacy_search[__trustedProperties]" value="trusted">
          </form>`,
          200,
          {getSetCookie: () => ["PHPSESSID=test-session; Path=/"]}
        );
      }
      return createResponse(resultHtml);
    });

    const pharmacies = await helper.fetchAponetData(
      {plz: "10115", radius: 5},
      "2026-08-11"
    );

    assert.equal(pharmacies.length, 1);
    assert.equal(calls.length, 2);
    assert.equal(calls[1].options.method, "POST");
    assert.equal(calls[1].options.headers.cookie, "PHPSESSID=test-session");
    assert.equal(
      calls[1].options.body.get("tx_aponetpharmacy_search[search][plzort]"),
      "10115"
    );
    assert.equal(
      calls[1].options.body.get("tx_aponetpharmacy_search[search][date]"),
      "2026-08-11"
    );
    mock.restoreAll();
  });
});

describe("getData", () => {
  it("skips an update while another request is running", async () => {
    const fetchMock = mock.method(globalThis, "fetch");
    helper.requestInProgress = true;
    const update = helper.getData({day: "today", plz: "10115", radius: 5});
    helper.requestInProgress = false;

    await update;

    assert.equal(fetchMock.mock.callCount(), 0);
    mock.restoreAll();
  });
});
