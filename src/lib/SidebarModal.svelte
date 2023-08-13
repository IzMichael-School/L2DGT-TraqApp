<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import { fly } from 'svelte/transition';
    export let xSide = 'left';
    const dispatch = createEventDispatcher();
</script>

<div
    class="z-[110] flex h-full max-h-full w-1/3 flex-col items-end justify-start overflow-auto rounded-lg bg-white p-5"
    transition:fly={{ x: 500, duration: 600 }}
>
    <div class="-mb-8 flex h-8 w-full flex-row items-center {xSide == 'left' ? 'justify-start' : 'justify-end'}">
        <button class="h-8 w-8" on:click={() => dispatch('close')}>
            <img src="/assets/icons/cross.svg" alt="Cross Icon" class="h-8 w-8 scale-125" />
        </button>
    </div>

    <slot />
</div>

<style>
</style>
