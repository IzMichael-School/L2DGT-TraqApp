<script lang="ts">
    export let value = 0,
        inactive = false;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<button
    on:click={() => dispatch('click')}
    on:contextmenu|preventDefault|stopPropagation={() => dispatch('contextmenu')}
    class="flex aspect-square h-7 w-7 shrink-0 cursor-pointer flex-row items-center justify-start overflow-hidden rounded-full border-2 transition-all duration-300 ease-in-out {value ==
        1 || inactive == true
        ? 'border-brand-lightgrey'
        : 'border-black'}"
>
    <span
        class="block h-full transition-all duration-300 ease-in-out {value == 1 ? 'bg-brand-lightgrey' : 'bg-black'}"
        style="width: {value * 100}%;"
    />
</button>

<style>
</style>
