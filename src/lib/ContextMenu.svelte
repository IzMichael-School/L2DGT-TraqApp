<script lang="ts">
    // Declare Props
    export let anchor: { x: number; y: number } = { x: 0, y: 0 },
        element: HTMLDivElement;

    // Import fade package
    import { fade } from 'svelte/transition';

    // Create dispatcher for click events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<!-- Context Menu Wrapper, complete with shadows, fade animations, and auto closing on action click -->
<!-- svelte-ignore a11y-click-events-have-key-events -->
<div
    class="absolute z-[200] w-64 overflow-hidden rounded-lg bg-white shadow-elevate-sm"
    style="top: {anchor.y}px; left: {anchor.x}px;"
    transition:fade={{ duration: 100 }}
    on:click={() => dispatch('close')}
    bind:this={element}
>
    <slot />
</div>

<style>
</style>
