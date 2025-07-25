const Fuse = require("fuse.js"); //for Fuzzy Matching (correcting spelling mistakes in city names)
const airports = require("aircodes"); // to get airport code for flights api

const fuse = new Fuse(airports, {
  keys: ["city", "name"],
  threshold: 0.3,
  ignoreLocation: true,
  minMatchCharLength: 3,
});

module.exports = function getAirportData(query) {
   if (!query) return null;

  const results = airports.findAirport(query.trim().toLowerCase());

  if (results && results.length > 0) {
    const airport = results[0];
    return {
      city: airport.city,
      iata: airport.iata,
    };
  }

  return null; // not found
};
