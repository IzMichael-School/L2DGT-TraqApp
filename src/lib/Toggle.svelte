<script lang="ts">
    export let variant: keyof typeof variants = 'default',
        value = false;
    export { xclass as class };
    let xclass: string | undefined;

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    $: dispatch('change', { value: value });

    const variants = {
        default: '',
    };
</script>

<label
    class="flex aspect-square h-6 w-6 flex-col items-center justify-center rounded-md border-2 border-blue-700 font-semibold transition-colors duration-200 ease-in-out {variants[
        variant
    ]} {xclass} {value ? 'bg-blue-500' : 'bg-transparent'}"
>
    <input type="checkbox" bind:checked={value} class="invisible h-0 w-0 overflow-hidden" />

    <img src="/assets/icons/check.svg" class="aspect-square h-full w-full -translate-y-0.5 invert" alt="Check Mark" />
</label>

<style>
</style>
