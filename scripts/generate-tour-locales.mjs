import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const ROOT = process.cwd();
const TOURS_DATA_PATH = path.join(ROOT, "src/features/tours/data/tours.ts");
const TOUR_CONTENT_PATH = path.join(
  ROOT,
  "src/features/tours/data/tour-content.ts",
);

const TOUR_IMAGE = "/images/tours/detail/hero-section.png";
const MIN_CAPACITY_OVERRIDES = {
  "santiago-coastal-escape-valparaiso-vina-del-mar-casablanca-wine-tasting": 2,
  "k-drama-dreamscape-journey-nami-island-petite-france-garden-of-morning-calm": 2,
  "dmz-deep-dive-private-peace-tour-from-seoul-with-3rd-tunnel-dora-observatory-suspension-bridge": 2,
};

const LOCALES = [
  { code: "de", name: "DE" },
  { code: "it", name: "IT" },
];

const TOUR_CONTENT_SKIP_KEYS = new Set([
  "key",
  "number",
  "icon",
]);

const TOUR_CATALOG_SKIP_KEYS = new Set([
  "id",
  "slug",
  "region",
  "operator",
  "operatorWebsite",
  "detailContentKey",
  "image",
]);

const BATCH_SEPARATOR = "\n|||TOUR_SEGMENT_SEPARATOR_91e5d7d7|||\n";
const BATCH_SIZE = 40;

function extractAssignedLiteral(source, variableName) {
  const declarationIndex = source.indexOf(variableName);

  if (declarationIndex === -1) {
    throw new Error(`Unable to find variable "${variableName}"`);
  }

  const equalsIndex = source.indexOf("=", declarationIndex);

  if (equalsIndex === -1) {
    throw new Error(`Unable to find assignment for "${variableName}"`);
  }

  let startIndex = equalsIndex + 1;
  while (startIndex < source.length && /\s/.test(source[startIndex])) {
    startIndex += 1;
  }

  const openingChar = source[startIndex];
  const closingChar = openingChar === "{" ? "}" : "]";

  if (!closingChar) {
    throw new Error(`Unsupported literal start for "${variableName}"`);
  }

  let depth = 0;
  let inString = false;
  let stringQuote = "";
  let escaped = false;

  for (let index = startIndex; index < source.length; index += 1) {
    const char = source[index];

    if (inString) {
      if (escaped) {
        escaped = false;
        continue;
      }

      if (char === "\\") {
        escaped = true;
        continue;
      }

      if (char === stringQuote) {
        inString = false;
      }

      continue;
    }

    if (char === "\"" || char === "'" || char === "`") {
      inString = true;
      stringQuote = char;
      continue;
    }

    if (char === openingChar) {
      depth += 1;
      continue;
    }

    if (char === closingChar) {
      depth -= 1;

      if (depth === 0) {
        return source.slice(startIndex, index + 1);
      }
    }
  }

  throw new Error(`Unable to extract literal for "${variableName}"`);
}

function evaluateLiteral(literal) {
  return vm.runInNewContext(`(${literal})`);
}

function getTourRows(source) {
  const literal = extractAssignedLiteral(source, "const TOUR_ROWS");
  return evaluateLiteral(literal);
}

function getTourDetailContent(source) {
  const literal = extractAssignedLiteral(source, "export const TOUR_DETAIL_CONTENT");
  return evaluateLiteral(literal);
}

function buildTourCatalog(rows) {
  return rows.map(
    ([
      slug,
      title,
      region,
      price,
      priceLabel,
      originalPriceLabel,
      operator,
      operatorWebsite,
      maxCapacityLabel,
      popularity,
      createdAt,
    ]) => ({
      id: slug,
      slug,
      title,
      price,
      priceLabel,
      originalPriceLabel,
      operator,
      operatorWebsite,
      minCapacity: MIN_CAPACITY_OVERRIDES[slug] ?? 1,
      maxCapacityLabel,
      region,
      rating: 4.5,
      reviewCount: 20,
      image: TOUR_IMAGE,
      popularity,
      createdAt,
      detailContentKey: slug,
    }),
  );
}

function shouldSkipByValue(value) {
  return (
    typeof value !== "string" ||
    value.length === 0 ||
    /^https?:\/\//.test(value) ||
    /^\d{4}-\d{2}-\d{2}$/.test(value) ||
    /^\d{2}:\d{2}$/.test(value) ||
    /^\/images\//.test(value)
  );
}

function collectStrings(value, skipKeys, pathParts = [], entries = []) {
  if (Array.isArray(value)) {
    value.forEach((item, index) =>
      collectStrings(item, skipKeys, [...pathParts, String(index)], entries),
    );
    return entries;
  }

  if (value && typeof value === "object") {
    Object.entries(value).forEach(([key, nestedValue]) => {
      if (skipKeys.has(key)) {
        return;
      }

      collectStrings(nestedValue, skipKeys, [...pathParts, key], entries);
    });
    return entries;
  }

  if (shouldSkipByValue(value)) {
    return entries;
  }

  entries.push({
    path: pathParts,
    value,
  });

  return entries;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function setValueAtPath(target, pathParts, nextValue) {
  let current = target;

  for (let index = 0; index < pathParts.length - 1; index += 1) {
    const key = pathParts[index];
    current = current[key];
  }

  current[pathParts[pathParts.length - 1]] = nextValue;
}

async function translateBatch(values, targetLocale) {
  const query = encodeURIComponent(values.join(BATCH_SEPARATOR));
  const url =
    `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLocale}&dt=t&q=${query}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `Translation request failed for ${targetLocale}: ${response.status} ${response.statusText}`,
    );
  }

  const payload = await response.json();
  const translatedText = payload[0].map((part) => part[0]).join("");
  const translatedValues = translatedText.split(BATCH_SEPARATOR);

  if (translatedValues.length !== values.length) {
    throw new Error(
      `Unexpected translation segment count for ${targetLocale}: expected ${values.length}, received ${translatedValues.length}`,
    );
  }

  return translatedValues.map((value) => value.trim());
}

async function translateEntries(entries, targetLocale) {
  const translations = new Map();

  for (let index = 0; index < entries.length; index += BATCH_SIZE) {
    const batch = entries.slice(index, index + BATCH_SIZE);
    const translatedBatch = await translateBatch(
      batch.map((entry) => entry.value),
      targetLocale,
    );

    batch.forEach((entry, batchIndex) => {
      translations.set(entry.path.join("."), translatedBatch[batchIndex]);
    });
  }

  return translations;
}

function applyTranslations(sourceValue, entries, translations) {
  const output = clone(sourceValue);

  entries.forEach((entry) => {
    const translatedValue = translations.get(entry.path.join("."));

    if (!translatedValue) {
      return;
    }

    setValueAtPath(output, entry.path, translatedValue);
  });

  return output;
}

function serializeTsExport(exportName, payload) {
  return `import type { TourDetailContent } from "../model/types";\n\nexport const ${exportName} = ${JSON.stringify(payload, null, 2)} as Record<string, TourDetailContent>;\n`;
}

function serializeTourCatalog(exportName, payload) {
  return `import type { Tour } from "../model/types";\n\nexport const ${exportName}: Tour[] = ${JSON.stringify(payload, null, 2)};\n`;
}

async function main() {
  const [toursSource, tourContentSource] = await Promise.all([
    fs.readFile(TOURS_DATA_PATH, "utf8"),
    fs.readFile(TOUR_CONTENT_PATH, "utf8"),
  ]);

  const tourCatalog = buildTourCatalog(getTourRows(toursSource));
  const tourDetailContent = getTourDetailContent(tourContentSource);

  const tourCatalogEntries = collectStrings(tourCatalog, TOUR_CATALOG_SKIP_KEYS);
  const tourDetailEntries = collectStrings(
    tourDetailContent,
    TOUR_CONTENT_SKIP_KEYS,
  );

  for (const locale of LOCALES) {
    console.log(`Generating locale files for ${locale.code}...`);

    const [catalogTranslations, detailTranslations] = await Promise.all([
      translateEntries(tourCatalogEntries, locale.code),
      translateEntries(tourDetailEntries, locale.code),
    ]);

    const localizedCatalog = applyTranslations(
      tourCatalog,
      tourCatalogEntries,
      catalogTranslations,
    );
    const localizedDetailContent = applyTranslations(
      tourDetailContent,
      tourDetailEntries,
      detailTranslations,
    );

    await Promise.all([
      fs.writeFile(
        path.join(ROOT, `src/features/tours/data/tours.${locale.code}.ts`),
        serializeTourCatalog(`TOUR_CATALOG_${locale.name}`, localizedCatalog),
      ),
      fs.writeFile(
        path.join(
          ROOT,
          `src/features/tours/data/tour-content.${locale.code}.ts`,
        ),
        serializeTsExport(
          `TOUR_DETAIL_CONTENT_${locale.name}`,
          localizedDetailContent,
        ),
      ),
    ]);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
