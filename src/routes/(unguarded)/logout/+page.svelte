<script lang="ts">
    // Import onmount library
    import { onMount } from 'svelte';

    // Run when page loaded
    onMount(() => {
        // Delete the saved login
        document.cookie = 'pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
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
