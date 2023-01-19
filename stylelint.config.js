/* eslint-disable @typescript-eslint/restrict-template-expressions */
import path from "path"

export default {
  extends: [`stylelint-config-standard`, `stylelint-config-recommended-scss`, `stylelint-config-prettier-scss`],
  customSyntax: `postcss-scss`,
  plugins: [`stylelint-scss`, `stylelint-no-unresolved-module`, `stylelint-prettier`],
  rules: {
    "plugin/no-unresolved-module": {
      alias: {
        "@utils": path.resolve(__dirname, `lib/utils`),
      },
    },
    "prettier/prettier": true,
    // "at-rule-no-unknown": [true, { ignoreAtRules: [`each`] }],
    // "function-no-unknown": [true, { ignoreFunctions: [`lightness`, `$`] }],
    "selector-class-pattern": [
      `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`,
      {
        message: selector => `Expected class selector "${selector}" to be kebab-case`,
        severity: `warning`,
      },
    ],
    "custom-property-pattern": [
      `^([a-z][a-z0-9]*)(-[a-z0-9]+)*$`,
      {
        message: selector => `Expected custom property name "${selector}" to be kebab-case`,
        severity: `warning`,
      },
    ],
    "import-notation": `string`,
    "font-family-no-missing-generic-family-keyword": null,
    "rule-empty-line-before": null,
    "scss/comment-no-empty": [null],
    "no-invalid-position-at-import-rule": null,
    "no-descending-specificity": [true, { severity: `warning` }],
    "color-function-notation": [null],
  },
}
