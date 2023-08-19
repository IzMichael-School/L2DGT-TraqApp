<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fade } from 'svelte/transition';
    const dispatch = createEventDispatcher();
</script>

<div
    class="absolute inset-0 z-[100] flex h-full w-full flex-row items-center justify-center bg-black/50 p-3 lg:p-7"
    on:mousedown|self={() => dispatch('close')}
    transition:fade={{ duration: 300 }}
>
    <slot />
</div>

<style>
</style>
