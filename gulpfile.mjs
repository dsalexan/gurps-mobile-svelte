/* eslint-disable jsdoc/require-jsdoc */
import fs from "fs-extra"

import path from "node:path"

import yargs from "yargs"
import { hideBin } from "yargs/helpers"
import glob from "glob"

import gulp from "gulp"
import replace from "gulp-replace"
import { deleteSync } from "del"
import vynil from "vinyl-paths"

import { MODULE_ID, MODULE_NAME, DESCRIPTION, VERSION, TITLE } from "./config/index.js"
import { writeFileSync } from "node:fs"

// #region CONFIGURATION

const name = MODULE_ID
const sourceDirectory = `./src`
const staticDirectory = `./static`
const destinationDirectory = `./dist`

const config = fs.readJSONSync(`${staticDirectory}/module.json`)
const DEV_PORT = 30001

const FOUNDRY = fs.readJSONSync(`foundryconfig.json`)

// #endregion

// #region BUNDLE

export function bundleClear() {
  return gulp.src([`${destinationDirectory}/*`], { base: `./` }).pipe(vynil(deleteSync))
}

export function bundleStatic() {
  // create dummy module files
  for (const file of config.esmodules)
    writeFileSync(
      `${destinationDirectory}/${file}`,
      `console.warn('${MODULE_ID}', 'File "${file}" was not bundled. Open Foundry through development server at port ${DEV_PORT} to access the module.')`,
    )

  return gulp.src(`${staticDirectory}/**/*`).pipe(gulp.dest(`${destinationDirectory}/`))
}

export function bundleModule() {
  const staticScripts = glob.sync(`*.js`, { cwd: path.resolve(staticDirectory, `js`) })

  const placeholder = name => `__GULP__${name}__`
  const scope = {
    MODULE_ID: `"${MODULE_ID}"`,
    MODULE_NAME: `"${MODULE_NAME}"`,
    MODULE_TITLE: `"${TITLE}"`,
    MODULE_DESCRIPTION: `"${DESCRIPTION}"`,
    MODULE_VERSION: `"${VERSION}"`,
    STATIC_SCRIPTS: staticScripts.map(script => `"js/${script}"`).join(`, `),
  }

  let file = gulp.src(`${destinationDirectory}/module.json`, { base: `./` })
  for (const [key, value] of Object.entries(scope)) {
    file = file.pipe(replace(new RegExp(`"?${placeholder(key)}"?`), value))
  }

  return file.pipe(gulp.dest(`./`))
}

// eslint-disable-next-line jsdoc/require-jsdoc
export const bundle = gulp.series(bundleClear, bundleStatic, bundleModule)

// #endregion

// #region FOUNDRY

/**
 * Get the data path of Foundry VTT based on what is configured in `foundryconfig.json`
 *
 * @returns {string}
 */
function getDataPath() {
  if (FOUNDRY?.dataPath) {
    if (!fs.existsSync(path.resolve(FOUNDRY.dataPath))) throw new Error(`User Data path invalid, no Data directory found`)

    return path.resolve(FOUNDRY.dataPath)
  } else {
    throw new Error(`No User Data path defined in foundryconfig.json`)
  }
}

/**
 * Link build to User Data folder
 */
export async function link() {
  let modulesDirectory
  if (fs.existsSync(path.resolve(destinationDirectory, `module.json`))) {
    modulesDirectory = `modules`
  } else {
    throw new Error(`Could not find module.json`)
  }

  const linkDirectory = path.resolve(getDataPath(), `Data`, modulesDirectory, name)

  const argv = yargs(hideBin(process.argv)).option(`clean`, {
    alias: `c`,
    type: `boolean`,
    default: false,
  }).argv
  const clean = argv.c

  if (clean) {
    console.log(`Removing build in ${linkDirectory}.`)

    await fs.remove(linkDirectory)
  } else if (!fs.existsSync(linkDirectory)) {
    console.log(`Linking dist to ${linkDirectory}.`)
    await fs.ensureDir(path.resolve(linkDirectory, `..`))
    await fs.symlink(path.resolve(destinationDirectory), linkDirectory)
  }
}

// #endregion
