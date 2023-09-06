<script lang="ts">
    // Create dispatcher for click events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();
</script>

<!-- Create Menu Button element, with styles and click event dispatcher -->
<button
    class="flex w-full cursor-pointer select-none flex-row items-center justify-start gap-2 p-2 hover:bg-slate-100"
    on:click={() => dispatch('click')}
>
    <slot />
</button>

<style>
</style>
