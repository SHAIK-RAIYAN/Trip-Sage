const { Searcher } = require("fast-fuzzy"); //for Fuzzy Matching (correcting spelling mistakes in city names)
const aircodes = require("aircodes"); // to get airport code for flights api

//Build a list of city names from aircodes data
// All airports
const allAirports = aircodes.findAirport("");

const indianAirports = allAirports.filter((a) => a.country === "India");
const globalAirports = allAirports;

const indianCities = Array.from(
  new Set(indianAirports.map((a) => a.city).filter(Boolean))
);
const globalCities = Array.from(
  new Set(globalAirports.map((a) => a.city).filter(Boolean))
);


//Create a fast-fuzzy Searcher on city names
const indianSearcher = new Searcher(indianCities, {
  threshold: 0.4,
  ignoreCase: true,
  normalizeWhitespace: true,
  ignoreSymbols: true,
});

const globalSearcher = new Searcher(globalCities, {
  threshold: 0.4,
  ignoreCase: true,
  normalizeWhitespace: true,
  ignoreSymbols: true,
});


module.exports = function getAirportData(query) {
  if (!query || typeof query !== "string") return null;

  const term = query.trim();
  
  //Fuzzy-search First try Indian cities
  const [indianMatch] = indianSearcher.search(term);

  if (indianMatch) {
    const match = indianAirports.find(
      (a) => a.city.toLowerCase() === indianMatch.toLowerCase()
    );
    if (match) return { city: match.city, iata: match.iata };
  }

  //Then try global cities
  const [globalMatch] = globalSearcher.search(term);
  if (globalMatch) {
    const match = globalAirports.find(
      (a) => a.city.toLowerCase() === globalMatch.toLowerCase()
    );
    if (match) return { city: match.city, iata: match.iata };
  }

  return null; // not found
};
