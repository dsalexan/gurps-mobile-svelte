/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-var-requires */

const fs = require(`fs`)
const path = require(`path`)

const prettierOptions = JSON.parse(fs.readFileSync(path.resolve(__dirname, `.prettierrc`), `utf8`))

module.exports = {
  parser: `@typescript-eslint/parser`,

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
    `plugin:@typescript-eslint/recommended`,
    `plugin:@typescript-eslint/recommended-requiring-type-checking`,
  ],

  plugins: [`prettier`, `svelte3`, `@typescript-eslint`],

  parserOptions: {
    extraFileExtensions: [`.svelte`],
    ecmaVersion: `latest`,
    sourceType: `module`,
    tsconfigRootDir: __dirname,
    project: [`./tsconfig.json`],
  },

  rules: {
    "prettier/prettier": [`error`, prettierOptions],
    //
    // "json/*": [`error`, `allowComments`],
    //
    semi: [`off`],
    quotes: [`warn`, `backtick`],
    "no-undef": [`error`],
    "no-unused-vars": [`off`],
    "jsdoc/require-param-description": [`off`],
    "jsdoc/require-returns-description": [`off`],
    //
    "@typescript-eslint/no-shadow": [
      `error`,
      {
        builtinGlobals: true,
        hoist: `all`,
        allow: [`document`, `event`, `name`, `parent`, `status`, `top`],
      },
    ],
    //
    //
    "@typescript-eslint/ban-ts-comment": [`warn`],
  },

  overrides: [
    {
      files: [`*.svelte`],
      processor: `svelte3/svelte3`,
    },
  ],

  settings: {
    "svelte3/typescript": require(`typescript`),
    // ignore style tags in Svelte because of Tailwind CSS
    // See https://github.com/sveltejs/eslint-plugin-svelte3/issues/70
    "svelte3/ignore-styles": () => true,
  },

  ignorePatterns: [`node_modules`],
}
