import { Given, When, Then } from "@cucumber/cucumber";
import axios from "axios";
import assert from "assert";

let response: any;

Given("the Activity Ranking API is available", function () {
  // Apenas validação conceitual
  return true;
});

When("the user types {string}", async function (query: string) {
  response = await axios.get(
    `https://ibp62gp1b9.execute-api.us-east-1.amazonaws.com/v1/suggest?query=${query}`
  );
});

Then("the API should return a list of matching city suggestions", function () {
  assert.ok(Array.isArray(response.data), "Response should be an array");
  assert.ok(response.data.length > 0, "Should return at least one suggestion");
});

Then("each suggestion should contain a city or town name", function () {
  response.data.forEach((item: any) => {
    assert.ok(item.name, "Suggestion must contain a name field");
  });
});

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

Then("the API should return 7 days of weather data", function () {
  assert.ok(response.data.daily, "Missing daily weather data");
  assert.strictEqual(
    response.data.daily.length,
    7,
    "Weather API must return 7 days"
  );
});

Then(
  "each day should include temperature, precipitation, and conditions",
  function () {
    response.data.daily.forEach((day: any) => {
      assert.ok(day.temperature, "Missing temperature");
      assert.ok(day.precipitation, "Missing precipitation");
      assert.ok(day.conditions, "Missing conditions");
    });
  }
);

When("the activities ranking API is requested", async function () {
  response = await axios.get(
    `https://ibp62gp1b9.execute-api.us-east-1.amazonaws.com/v1/activities?lat=${this.lat}&lon=${this.lon}`
  );
});

Then(
  "the API should return a list of activities for 7 days",
  function () {
    assert.ok(Array.isArray(response.data), "Response must be an array");
    assert.strictEqual(response.data.length, 7);
  }
);

Then(
  "each activity should include a date, activity name, rank, and reasoning",
  function () {
    response.data.forEach((item: any) => {
      assert.ok(item.date);
      assert.ok(item.activity);
      assert.ok(item.rank);
      assert.ok(item.reasoning);
    });
  }
);

Then("the API should return an empty suggestion list", function () {
  assert.strictEqual(response.data.length, 0);
});
