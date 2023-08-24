<script lang="ts">
    import Button from '$lib/Button.svelte';
    import { goto } from '$app/navigation';
</script>

<svelte:head>
    <title>Traq</title>
</svelte:head>

<Button variant="default" on:click={() => goto('/login')}>Login</Button>
<Button variant="default" on:click={() => goto('/register')}>Register</Button>

<style>
</style>
