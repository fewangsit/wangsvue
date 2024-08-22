import { countries, zones } from 'moment-timezone/data/meta/latest.json';

interface LocationData {
  timezone: string;
  region: string;
  city: string;
  country: string;
}

const timeZoneCityToCountry: Record<string, string> = {};

// Populate the dictionary
Object.keys(zones).forEach((z) => {
  const cityArr = z.split('/');
  const city = cityArr[cityArr.length - 1];
  timeZoneCityToCountry[city] =
    countries[
      zones[z as keyof typeof zones].countries[0] as keyof typeof countries
    ].name;
});

// Manually add missing or incorrect mappings (e.g., "Calcutta" to "Kolkata")

export default function getUserLocation(): LocationData {
  const userTimeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const [userRegion, ...cityParts] = userTimeZone.split('/');
  const userCity = cityParts.join('/'); // Join remaining parts for cities like "New York"

  return {
    timezone: userTimeZone,
    region: userRegion,
    city: userCity,
    country: timeZoneCityToCountry[userCity] || 'Unknown', // Handle missing cities
  };
}
