<script lang="ts">
    // Import onmount library
    import { onMount } from 'svelte';

    // Run when page loaded
    onMount(() => {
        // Redirect to home page
        window.location.href = '/';
    });
</script>

<!-- Display simple logging out message to user -->
<div class="flex h-full w-full flex-col items-center justify-center">
    <div class="rounded-lg bg-zinc-200 p-5">
        <h1 class="text-3xl">Logging you out...</h1>
    </div>
</div>

<style>
</style>
