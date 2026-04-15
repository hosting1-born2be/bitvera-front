import countryList from "react-select-country-list";

import { excludedCountries } from "@/shared/lib/countries";

export type CountryOption = { value: string; label: string };

const allCountries = countryList().getData() as CountryOption[];

export const formCountries = allCountries
  .filter((c: CountryOption) => !excludedCountries.includes(c.value.toLowerCase()))
  .sort((a: CountryOption, b: CountryOption) => a.label.localeCompare(b.label));
