<script>
   import {
      applyPosition,
      resizeObserver }        from '@typhonjs-fvtt/runtime/svelte/action';

   import { draggableGsap }   from '@typhonjs-fvtt/runtime/svelte/gsap';

   export let box = void 0;

   // This is run once when the component is created. It sets the position width / height to 'auto'.
   box.position.set({ width: 'auto', height: 'auto' });
</script>

<div use:applyPosition={box.position}
     use:draggableGsap={{ position: box.position, inertia: true }}
     use:resizeObserver={box.position}
     style:background={box.color}></div>

<style>
   div {
      position: absolute;
      border-radius: 0.25em;
      border: solid brown 2px;
      min-width: 100px;
      min-height: 100px;
   }
</style>