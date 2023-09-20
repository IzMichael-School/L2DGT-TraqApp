<script lang="ts">
    // Create dispatcher for click events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Import fly transition library
    import { fly } from 'svelte/transition';

    // Declare Props
    export let xSide = 'left';
</script>

<!-- Wrapper for a sidebar modal, includes fly in/out animation, close button -->
<div
    class="z-[110] flex h-full max-h-full w-full flex-col items-end justify-start overflow-auto rounded-t-3xl bg-white p-5 lg:w-1/3 lg:rounded-lg"
    transition:fly={{ x: 500, duration: 600 }}
>
    <!-- Close button, exact method controlled on use -->
    <div class="-mb-8 flex h-8 w-full flex-row items-center {xSide == 'left' ? 'justify-start' : 'justify-end'}">
        <button class="h-8 w-8" on:click={() => dispatch('close')}>
            <img src="/assets/icons/cross.svg" alt="Cross Icon" class="h-8 w-8 scale-125" />
        </button>
    </div>

    <!-- Replaced with component contents specified on use -->
    <slot />
</div>

<style>
</style>
