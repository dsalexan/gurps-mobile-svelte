const fs = require(`fs`)
const path = require(`path`)

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, `.prettierrc`), `utf8`))

module.exports = {
  env: {
    node: true,
    browser: true,
    es2021: true,
    jquery: true,
  },

  extends: [
    `@typhonjs-config/eslint-config/esm/2022/browser`,
    `plugin:prettier/recommended`, //
    `eslint:recommended`,
    `@typhonjs-fvtt/eslint-config-foundry.js`,
    `plugin:jsdoc/recommended`,
  ],

  plugins: [`prettier`, `json`],

  parserOptions: {
    extraFileExtensions: [`.cjs`, `.mjs`],
    ecmaVersion: `latest`,
    sourceType: `module`,
  },

  rules: {
    "prettier/prettier": [`error`, prettierOptions],
    //
    "json/*": [`error`, `allowComments`],
    //
    semi: [`off`],
    quotes: [`warn`, `backtick`],
    "no-undef": [`error`],
    "no-unused-vars": [`off`],
    "jsdoc/require-param-description": [`off`],
    "jsdoc/require-returns-description": [`off`],
    //
    "no-shadow": [
      `error`,
      {
        builtinGlobals: true,
        hoist: `all`,
        allow: [`document`, `event`, `name`, `parent`, `status`, `top`],
      },
    ],
  },
}
