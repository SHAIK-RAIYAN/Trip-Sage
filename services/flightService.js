// services/flightService.js
const SerpApi = require("google-search-results-nodejs");
require("dotenv").config();

const API_KEY = process.env.SERP_API_KEY;
const search = new SerpApi.GoogleSearch(API_KEY);

exports.fetchBestFlights = (tripData) => {
  return new Promise((resolve, reject) => {
    search.json(
      {
        engine: "google_flights",
        departure_id: tripData.source,
        arrival_id: tripData.destination, 
        outbound_date: tripData.startDate, 
        return_date: tripData.endDate, // YYYY-MM-DD
        currency: "INR",
        hl: "en",
        api_key: API_KEY,
      },
      (result) => {
        if (result.best_flights && Array.isArray(result.best_flights)) {
          resolve(result.best_flights);
        } else {
          resolve([]); // no best_flights returned
        }
      }
    );
  });
};
