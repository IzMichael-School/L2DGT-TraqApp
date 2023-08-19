<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    import { colors, type Color } from '$lib/lib';
    export let colorname: Color,
        icon: string,
        label: string,
        active = false;
</script>

<button
    class="group flex aspect-square flex-col items-center justify-center p-2 text-lg max-lg:h-full lg:w-full"
    class:active
    style="--color: {colors[colorname]}; --default: {colors.paleblue};"
    on:click={() => dispatch('click')}
>
    <img src="/assets/icons/{icon}" alt="{label} Icon" class="w-2/3 group-hover:invert lg:w-1/2" />
    <h3 class="text-sm group-hover:text-white lg:text-lg">{label}</h3>
</button>

<style>
    * {
        @apply transition-all duration-300 ease-in-out;
    }

    button {
        background-color: var(--default);
        color: #ffffff;
    }

    button img {
        filter: invert(1);
    }

    button:hover,
    button.active {
        background-color: var(--color);
    }
</style>
