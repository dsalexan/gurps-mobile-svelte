// @ts-nocheck
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable camelcase */

import fs from "fs-extra"
import { svelte } from "@sveltejs/vite-plugin-svelte"
import resolve from "@rollup/plugin-node-resolve" // This resolves NPM modules from node_modules.
import preprocess from "svelte-preprocess"
import { postcssConfig, terserConfig, typhonjsRuntime } from "@typhonjs-fvtt/runtime/rollup"
import topLevelAwait from "vite-plugin-top-level-await"

import { MODULE_ID } from "./config"
import path from "path"

const FOUNDRY = fs.readJSONSync(`foundryconfig.json`)
const STATIC_SUBDIRECTORIES = fs.readdirSync(path.join(__dirname, `static`)).filter(name => fs.statSync(path.join(__dirname, `static`, name)).isDirectory())

const s_COMPRESS = false // Set to true to compress the module bundle.
const s_SOURCEMAPS = true // Generate sourcemaps for the bundle (recommended).

// EXPERIMENTAL: Set to true to enable linking against the TyphonJS Runtime Library module.
// You must add a Foundry module dependency on the `typhonjs` Foundry package or manually install it in Foundry from:
// https://github.com/typhonjs-fvtt-lib/typhonjs/releases/latest/download/module.json
const s_TYPHONJS_MODULE_LIB = false

// Used in bundling.
const s_RESOLVE_CONFIG = {
  browser: true,
  dedupe: [`svelte`],
}

// ATTENTION!
// You must change `base` and the `proxy` strings replacing `/modules/essential-svelte-esm/` with your
// module or system ID.

export default () => {
  /** @type {import('vite').UserConfig} */
  return {
    root: `src/`, // Source location / esbuild root.
    base: `/modules/${MODULE_ID}/`, // Base module path that 30001 / served dev directory.
    publicDir: false, // No public resources to copy.
    cacheDir: `../.vite-cache`, // Relative from root directory.

    resolve: { conditions: [`import`, `browser`] },

    esbuild: {
      target: [`esnext`],
      keepNames: true, // Note: doesn't seem to work.
    },

    css: {
      // Creates a standard configuration for PostCSS with autoprefixer & postcss-preset-env.
      postcss: postcssConfig({ compress: s_COMPRESS, sourceMap: s_SOURCEMAPS }),
    },

    // About server options:
    // - Set to `open` to boolean `false` to not open a browser window automatically. This is useful if you set up a
    // debugger instance in your IDE and launch it with the URL: 'http://localhost:30001/game'.
    //
    // - The top proxy entry for `lang` will pull the language resources from the main Foundry / 30000 server. This
    // is necessary to reference the dev resources as the root is `/src` and there is no public / static resources
    // served.
    server: {
      port: 30001,
      open: `/game`,
      proxy: {
        ...Object.fromEntries(STATIC_SUBDIRECTORIES.map(folder => [`/modules/${MODULE_ID}/${folder}`, `http://localhost:30000`])),
        [`^(?!/modules/${MODULE_ID}/)`]: `http://localhost:30000`,
        "/socket.io": { target: `ws://localhost:30000`, ws: true },
      },
      hmr: true,
      watch: {
        //   cwd: `./src`,
        //   followSymlinks: true,
      },
    },

    build: {
      outDir: path.resolve(__dirname, `dist`),
      emptyOutDir: false,
      sourcemap: s_SOURCEMAPS,
      brotliSize: true,
      minify: s_COMPRESS ? `terser` : false,
      target: [`esnext`],
      terserOptions: s_COMPRESS ? { ...terserConfig(), ecma: 2022 } : void 0,
      lib: {
        entry: `./index.js`,
        formats: [`es`],
        fileName: `index`,
      },
      // rollupOptions: {
      //    treeshake: 'smallest',
      // }
    },

    // optimizeDeps: {
    //    disabled: false
    // },

    plugins: [
      function HMR() {
        return {
          name: `hmr`,
          enforce: `post`,
          // HMR
          handleHotUpdate({ file, server, ...args }) {
            console.log(file, args)
            if (file.endsWith(`.js`)) server.ws.send({ type: `full-reload`, path: `*` })
          },
        }
      },
      topLevelAwait({
        // The export name of top-level await promise for each chunk module
        promiseExportName: `__tla`,
        // The function to generate import names of top-level await promise in each chunk module
        promiseImportName: i => `__tla_${i}`,
      }),
      svelte({
        preprocess: preprocess(),
        onwarn: (warning, handler) => {
          // Suppress `a11y-missing-attribute` for missing href in <a> links.
          // Foundry doesn't follow accessibility rules.
          if (warning.message.includes(`<a> element should have an href attribute`)) {
            return
          }

          // Let Rollup handle all other warnings normally.
          handler(warning)
        },
      }),

      resolve(s_RESOLVE_CONFIG), // Necessary when bundling npm-linked packages.

      // When s_TYPHONJS_MODULE_LIB is true transpile against the Foundry module version of TRL.
      s_TYPHONJS_MODULE_LIB && typhonjsRuntime(),
    ],
  }
}
