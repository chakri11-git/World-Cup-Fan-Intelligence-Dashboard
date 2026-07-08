export default [
  {
    ignores: ["dist/**", "node_modules/**", "build/**"]
  },
  {
    files: ["**/*.js", "**/*.jsx"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        window: "writable",
        document: "writable",
        console: "writable",
        localStorage: "writable",
        import: "readonly",
        process: "readonly",
        // Vitest globals
        describe: "readonly",
        it: "readonly",
        expect: "readonly",
        vi: "readonly"
      }
    },
    rules: {
      "no-unused-vars": "warn"
    }
  }
];
