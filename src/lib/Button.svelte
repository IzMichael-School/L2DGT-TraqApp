<script lang="ts">
    // Declare Props
    export let variant: keyof typeof variants = 'default',
        nominwidth: boolean | undefined = undefined;
    export { xclass as class };
    let xclass: string | undefined;

    // Create dispatcher for click events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Declare style variants
    const variants = {
        default: 'bg-brand-blue text-white hover:brightness-90 group-hover:brightness-90',
        secondary: 'bg-gray-200 text-black hover:brightness-90 group-hover:brightness-90',
        danger: 'bg-brand-red text-white hover:bg-red-600 group-hover:bg-red-600',
        outline:
            'bg-transparent border border-gray-400 hover:bg-gray-100 group-hover:bg-gray-100 hover:border-gray-900 group-hover:border-gray-900',
        ghost: 'bg-transparent hover:bg-gray-100 group-hover:bg-gray-100',
        unstyled: '',
    };
</script>

<!-- Create the button element, with default styles, variant additions, prop additions, and click event dispatcher -->
<button
    class="{nominwidth != undefined
        ? ''
        : 'min-w-[8rem]'} rounded-lg px-5 py-2 font-semibold transition-colors duration-200 ease-in-out {variants[
        variant
    ]} {xclass}"
    on:click={() => {
        dispatch('click');
    }}
>
    <slot />
</button>

<style>
</style>
