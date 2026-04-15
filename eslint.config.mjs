import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import simpleImportSort from "eslint-plugin-simple-import-sort";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  {
    plugins: {
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "simple-import-sort/imports": [
        "error",
        {
          groups: [
            ["^react$", "^next$", "^next/.*$"],
            ["^@?\\w"],
            ["^@/features/(.*)$"],
            ["^@/shared/(.*)$"],
            ["^\\.\\./(.*)$", "^\\./(.*)$"],
            ["^.+\\.s?css$"],
          ],
        },
      ],
      "simple-import-sort/exports": "error",
    },
  },

  // Важливо: ігнори, які Next радить додати у flat config
  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
