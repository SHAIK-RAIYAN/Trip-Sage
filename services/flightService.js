const SerpApi = require("google-search-results-nodejs");
const ExpressError = require("../utils/ExpressError");
require("dotenv").config();

const API_KEY = process.env.SERP_API_KEY;
const search = new SerpApi.GoogleSearch(API_KEY);

exports.fetchBestFlights = (tripData) => {
  return new Promise((resolve, reject) => {
    try {
      search.json(
        {
          engine: "google_flights",
          departure_id: tripData.source,
          arrival_id: tripData.destination,
          outbound_date: tripData.startDate,
          return_date: tripData.endDate,
          currency: "INR",
          hl: "en",
          api_key: API_KEY,
        },
        (result) => {
          if (result?.best_flights && Array.isArray(result.best_flights)) {
            return resolve(result.best_flights);
          }
          // No flights found
         return resolve([]);
        }
      );
    } catch (err) {
      return reject(
        new ExpressError(
          "Unable to fetch flight data at the moment. Please try again later.",
          502,
          "FLIGHT_API_ERROR"
        )
      );
    }
  });
};
