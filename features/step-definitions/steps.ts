import { Given, When, Then } from "@cucumber/cucumber";
import axios from "axios";
import assert from "assert";

let response: any;

Given("the Activity Ranking API is available", function () {
  return true;
});

//
// CITY SUGGESTIONS
//
When("the user types {string}", async function (query: string) {
  response = await axios.get(
    `https://ibp62gp1b9.execute-api.us-east-1.amazonaws.com/v1/suggest?query=${query}`
  );
});

Then("the API should return at least one city suggestion", function () {
  assert.ok(Array.isArray(response.data), "Response must be an array");
  assert.ok(response.data.length > 0, "Expected at least one suggestion");
});

Then(
  "each suggestion should include name, country, latitude and longitude",
  function () {
    response.data.forEach((item: any) => {
      assert.ok(item.name, "Missing name");
      assert.ok(item.country, "Missing country");
      assert.ok(item.lat !== undefined, "Missing latitude");
      assert.ok(item.lon !== undefined, "Missing longitude");
    });
  }
);

Then("the API should return zero suggestions", function () {
  assert.ok(Array.isArray(response.data));
  assert.strictEqual(response.data.length, 0);
});

//
// WEATHER
//
Given(
  "the user has selected a city with latitude {string} and longitude {string}",
  function (lat: string, lon: string) {
    this.lat = lat;
    this.lon = lon;
  }
);

When("the weather API is requested", async function () {
  response = await axios.get(
    `https://ibp62gp1b9.execute-api.us-east-1.amazonaws.com/v1/weather?lat=${this.lat}&lon=${this.lon}`
  );
});

Then("the API should return daily weather data for 7 days", function () {
  assert.ok(response.data.daily, "Missing daily field");
  assert.ok(Array.isArray(response.data.daily.time), "daily.time must be array");
  assert.strictEqual(
    response.data.daily.time.length,
    7,
    "Expected 7 days of weather data"
  );
});

Then(
  "each day should include max temperature, min temperature and precipitation sum",
  function () {
    const daily = response.data.daily;

    daily.temperature_2m_max.forEach((v: any) =>
      assert.ok(v !== undefined, "Missing max temperature")
    );
    daily.temperature_2m_min.forEach((v: any) =>
      assert.ok(v !== undefined, "Missing min temperature")
    );
    daily.precipitation_sum.forEach((v: any) =>
      assert.ok(v !== undefined, "Missing precipitation sum")
    );
  }
);

//
// ACTIVITIES
//
When("the activities ranking API is requested", async function () {
  response = await axios.get(
    `https://ibp62gp1b9.execute-api.us-east-1.amazonaws.com/v1/activities?lat=${this.lat}&lon=${this.lon}`
  );
});

Then("the API should return a list of activities", function () {
  assert.ok(response.data.activities, "Missing activities field");
  assert.ok(
    Array.isArray(response.data.activities),
    "activities must be an array"
  );
  assert.ok(response.data.activities.length > 0, "No activities returned");
});

Then("each activity should include activity name and score", function () {
  response.data.activities.forEach((item: any) => {
    assert.ok(item.activity, "Missing activity name");
    assert.ok(item.score !== undefined, "Missing score");
  });
});

Then("the response should include a snapshot summary", function () {
  assert.ok(response.data.snapshot, "Missing snapshot");
  const snap = response.data.snapshot;
  assert.ok(snap.avg_temp !== undefined);
  assert.ok(snap.max_precip !== undefined);
  assert.ok(snap.total_snowfall !== undefined);
  assert.ok(snap.avg_cloud !== undefined);
  assert.ok(snap.max_wind !== undefined);
});

//
// TIMEOUT
//
When("the weather API takes too long to respond", async function () {
  try {
    await axios.get(
      `https://ibp62gp1b9.execute-api.us-east-1.amazonaws.com/v1/weather?lat=${this.lat}&lon=${this.lon}`,
      { timeout: 50 } // força timeout
    );
  } catch (err: any) {
    this.timeoutError = err;
  }
});

Then("the system should handle the timeout gracefully", function () {
  assert.ok(this.timeoutError, "Expected timeout error");
  assert.strictEqual(this.timeoutError.code, "ECONNABORTED");
});