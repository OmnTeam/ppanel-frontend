import { defineConfig } from "i18next-cli";

/**
 * i18next CLI configuration
 *
 * Used for extracting translation keys and managing translation files.
 * Inherits language settings from the shared i18n configuration.
 *
 * @see https://github.com/i18next/i18next-cli
 */
export default defineConfig({
  // Use supported languages from shared config
  locales: ["en-US", "zh-CN"],

  // Extraction configuration
  extract: {
    input: [
      "src/**/*.{js,jsx,ts,tsx}",
      "../../packages/ui/src/**/*.{js,jsx,ts,tsx}",
    ], // Source files to scan
    output: "public/assets/locales/{{language}}/{{namespace}}.json", // Output path template
  },
});
