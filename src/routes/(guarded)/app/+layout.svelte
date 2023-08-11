<script lang="ts">
    import { goto } from '$app/navigation';
    import Button from '$lib/Button.svelte';
    import { saving } from '$lib/pocketbase';
</script>

<div
    class="flex h-screen w-screen flex-row items-center justify-start gap-14 overflow-hidden overscroll-none bg-slate-50 pl-14"
>
    <div
        id="sidebar"
        class="flex h-full w-72 flex-col items-center justify-start bg-brand-lavender px-5 shadow-elevate"
    >
        <div
            class="mt-7 mb-7 flex h-20 w-[22rem] flex-col items-center justify-center rounded-xl bg-brand-blue shadow-elevate"
        >
            <h1 class="text-4xl font-bold text-white">TRAQ</h1>
        </div>

        <Button variant="default" class="mb-3 w-full text-lg" on:click={() => goto('/app/tasks')}>Tasks</Button>
        <Button variant="default" class="mb-3 w-full text-lg" on:click={() => goto('/app/habits')}>Habits</Button>

        <div class="w-0 flex-1 overflow-hidden" />

        {#if $saving == true}
            <p>Saving...</p>
        {/if}
    </div>

    <div class="h-full max-h-full max-w-full flex-1 overflow-x-auto overflow-y-auto py-14 pr-14 pl-7">
        <slot />
    </div>
</div>

<style>
</style>
