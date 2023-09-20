<script lang="ts">
    // Import onmount library
    import { onMount } from 'svelte';

    // Run when page loaded
    onMount(async () => {
        // Delete the saved login
        document.cookie = 'pb_auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        window.localStorage.removeItem('pocketbase_auth');
        // Wait 2 seconds for cookie to clear
        await sleep(2);
        // Redirect to home page
        window.location.href = '/';
    });

    // Sleep function, waits specified amount of seconds
    function sleep(s: number) {
        return new Promise((resolve) => setTimeout(resolve, s * 1000));
    }
</script>

<!-- Display simple logging out message to user -->
<div class="flex h-screen w-full flex-col items-center justify-center">
    <div class="rounded-lg bg-zinc-200 p-5">
        <h1 class="text-3xl">Logging you out in 2 seconds...</h1>
    </div>
</div>

<style>
</style>
