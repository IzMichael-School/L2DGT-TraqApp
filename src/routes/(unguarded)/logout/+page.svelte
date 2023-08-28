<script lang="ts">
    import { onMount } from 'svelte';

    onMount(() => {
        console.log('redirect');
        window.location.href = '/login';
    });
</script>

<div class="flex h-full w-full flex-col items-center justify-center">
    <div class="rounded-lg bg-zinc-200 p-5">
        <h1 class="text-3xl">Logging you out...</h1>
    </div>
</div>

<style>
</style>
