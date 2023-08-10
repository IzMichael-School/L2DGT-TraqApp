<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    export let anchor: { x: number; y: number } = { x: 0, y: 0 },
        element: HTMLDivElement;
    import { fade } from 'svelte/transition';
    const dispatch = createEventDispatcher();
</script>

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
