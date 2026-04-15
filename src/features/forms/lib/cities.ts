import type { CountryOption } from "./countries";
import { formCountries } from "./countries";

// Alias for consistency
type SelectOption = CountryOption;

// Cache for cities by country
const citiesCache = new Map<string, SelectOption[]>();

/**
 * Get country name by country code
 */
function getCountryNameByCode(countryCode: string): string | null {
  const country = formCountries.find(
    (c) => c.value.toLowerCase() === countryCode.toLowerCase()
  );
  return country?.label || null;
}

/**
 * Normalize city name for value (lowercase, replace spaces with underscores)
 */
function normalizeCityValue(cityName: string): string {
  return cityName.toLowerCase().replace(/\s+/g, "_");
}

/**
 * Format city name for display (capitalize first letter of each word)
 */
function formatCityLabel(cityName: string): string {
  return cityName
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

/**
 * Fetch cities for a country from API
 */
async function fetchCitiesFromAPI(countryCode: string): Promise<SelectOption[]> {
  const countryName = getCountryNameByCode(countryCode);
  
  if (!countryName) {
    return [{ value: "other", label: "Other" }];
  }

  try {
    const response = await fetch(
      `/api/cities?country=${encodeURIComponent(countryName)}`
    );

    if (!response.ok) {
      console.error(`Failed to fetch cities for ${countryCode}: ${response.status}`);
      return [{ value: "other", label: "Other" }];
    }

    const data = (await response.json()) as { cities?: string[]; error?: string };

    if (data.error || !data.cities || data.cities.length === 0) {
      return [{ value: "other", label: "Other" }];
    }

    // Convert city names to SelectOption format
    const cityOptions: SelectOption[] = data.cities
      .map((city) => ({
        value: normalizeCityValue(city),
        label: formatCityLabel(city),
      }))
      .sort((a, b) => a.label.localeCompare(b.label));

    // Add "Other" option at the end
    cityOptions.push({ value: "other", label: "Other" });

    return cityOptions;
  } catch (error) {
    console.error(`Error fetching cities for ${countryCode}:`, error);
    return [{ value: "other", label: "Other" }];
  }
}

/**
 * Get cities for a specific country code
 * Fetches from API and caches the result
 */
export async function getCitiesByCountry(
  countryCode: string | null | undefined
): Promise<SelectOption[]> {
  if (!countryCode) {
    return [];
  }

  const normalizedCode = countryCode.toLowerCase();

  // Check cache first
  if (citiesCache.has(normalizedCode)) {
    return citiesCache.get(normalizedCode)!;
  }

  // Fetch from API
  const cities = await fetchCitiesFromAPI(normalizedCode);

  // Cache the result
  citiesCache.set(normalizedCode, cities);

  return cities;
}
