// module.exports = {
//   'extends': 'react-app',
// };

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:prettier/recommended",
  ],
  globals: {
    SharedArrayBuffer: "readonly",
    localStorage: true,
  },
  env: {
    node: true,
    es6: true,
    browser: true,
    jest: true,
  },
  parser: "babel-eslint",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["react"],
  rules: {
    "no-console": "warn",
    "no-eval": "error",
  },
};
