Feature: Activity Ranking API – City-Based Weather Forecast Integration

  As a user, I want to search for a city, view weather data for 7 days,
  and receive a ranked list of activities based on weather conditions.

  Background:
    Given the Activity Ranking API is available

  Scenario: User receives autocomplete suggestions while typing a city name
    When the user types "votuporanga"
    Then the API should return at least one city suggestion
    And each suggestion should include name, country, latitude and longitude

  Scenario: User retrieves 7-day weather data for a selected city
    Given the user has selected a city with latitude "-20.71889" and longitude "-46.60972"
    When the weather API is requested
    Then the API should return daily weather data for 7 days
    And each day should include max temperature, min temperature and precipitation sum

  Scenario: User receives ranked activities based on weather
    Given the user has selected a city with latitude "-20.71889" and longitude "-46.60972"
    When the activities ranking API is requested
    Then the API should return a list of activities
    And each activity should include activity name and score
    And the response should include a snapshot summary

  Scenario: Invalid city returns no suggestions
    When the user types "zzzzzz"
    Then the API should return zero suggestions

  Scenario: API timeout handling
    Given the user has selected a city with latitude "-20.71889" and longitude "-46.60972"
    When the weather API takes too long to respond
    Then the system should handle the timeout gracefully

