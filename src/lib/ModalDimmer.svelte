<script lang="ts">
    // Create dispatcher for click events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Import fade package
    import { fade } from 'svelte/transition';
</script>

<!-- Covers the viewport, dims the screen to display a modal or sidebar -->
<div
    class="absolute inset-0 z-[100] flex h-full w-full flex-row items-center justify-center bg-black/50 p-3 lg:p-7"
    on:mousedown|self={() => dispatch('close')}
    transition:fade={{ duration: 300 }}
>
    <slot />
</div>

<style>
</style>
