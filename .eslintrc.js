module.exports = {
  env: {
    node: true,
    commonjs: true,
  },
  extends: "eslint:recommended",
  parserOptions: {
    ecmaVersion: 12,
  },
  rules: {
    "no-unused-vars": ["error", { argsIgnorePattern: "next" }],
  },
};
