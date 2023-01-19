// import MenuApplication from "./view/MenuApplication.js"

import { MODULE_ID } from "../config"

// You only need to include this if you would like to use the TRL TinyMCE oEmbed plugin for video embeds.
// import "@typhonjs-fvtt/runtime/tinymce"

// import "./chatmessage.js" // Loads the hooks specific to the chat message demo.

/**
 * Launches and positions the main `essential-svelte-esm` menu app to the left of the sidebar.
 */
Hooks.once(`ready`, () => {
  console.log(`SVELTE TESTS 7`)
  const sidebarRect = document.querySelector(`#sidebar`).getBoundingClientRect()
  //   new MenuApplication({ left: sidebarRect.x - 235, top: sidebarRect.y }).render(true, { focus: true })
})

console.error(`PAGE RELOADED again? vambora 8`)
