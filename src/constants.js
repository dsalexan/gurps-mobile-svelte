/**
 * Defines the main constants for module name and label.
 *
 * @type {{moduleId: string, moduleLabel: string}}
 */
const constants = {
  moduleId: `essential-svelte-esm`,
  moduleLabel: `Essential Svelte (ESM)`,
}

/**
 * @type {ESSessionConstants} Defines all the module session storage static constants.
 */
const sessionConstants = {
  themeDarkMode: `${constants.moduleId}.theme.dark`,
}

export { constants, sessionConstants }

/**
 * @typedef {object} ESSessionConstants
 *
 * @property {string} themeDarkMode - Indicates whether dark mode is enabled.
 */
