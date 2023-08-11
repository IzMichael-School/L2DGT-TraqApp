<script lang="ts">
    import Button from '$lib/Button.svelte';
    import { goto } from '$app/navigation';
</script>

<Button variant="default" on:click={() => goto('/login')}>Login</Button>
<Button variant="default" on:click={() => goto('/register')}>Register</Button>

<style>
</style>
