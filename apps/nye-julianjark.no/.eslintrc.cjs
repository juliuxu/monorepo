/** @type {import('eslint').Linter.Config} */
module.exports = {
  extends: [
    "@remix-run/eslint-config",
    "@remix-run/eslint-config/node",
    "plugin:prettier/recommended",
    "prettier",
  ],
  plugins: ["simple-import-sort"],
  rules: {
    "simple-import-sort/imports": [
      "error",
      {
        groups: [
          // Load imports with side-effects first, because duh
          ["^\\u0000"],
          // node, react + remix imports at the top
          ["^node:\\w", "^react(-dom)?/?", "^@remix-run/\\w"],
          // Other npm imports
          ["^@?\\w"],
          // Relative imports
          ["^~", "^\\."],
        ],
      },
    ],
  },
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
  },
};
