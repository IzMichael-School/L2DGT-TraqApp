<script lang="ts">
    import Button from '$lib/Button.svelte';
    import { goto } from '$app/navigation';
</script>

<Button variant="default" action={() => goto('/login')}>Login</Button>
<Button variant="default" action={() => goto('/register')}>Register</Button>

<style>
</style>
