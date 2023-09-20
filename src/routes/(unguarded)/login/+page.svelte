<script lang="ts">
    // Import libraries, stores
    import { applyAction, enhance } from '$app/forms';
    import { pb } from '$lib/pocketbase';

    // Import active form data for progressive enchancement
    export let form;

    // Declare variables
    let loading = false;

    // Import custom components
    import UnauthedNavbar from '$lib/UnauthedNavbar.svelte';
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
</script>

<!-- Window Title -->
<svelte:head>
    <title>Log In | Traq</title>
</svelte:head>

<div class="mx-auto flex h-full max-h-full w-full flex-col items-center justify-start overflow-auto px-5 pb-5 lg:w-3/5">
    <UnauthedNavbar />

    <!-- Login form -->
    <form
        method="POST"
        class="flex w-full flex-col items-center justify-start p-5 lg:flex-1 lg:p-0"
        use:enhance={() => {
            // Load auth from cookie, apply return state action
            return async ({ result }) => {
                pb.authStore.loadFromCookie(document.cookie);
                await applyAction(result);
                loading = false;
            };
        }}
        on:submit={() => (loading = true)}
    >
        <h1 class="font-title mb-3 w-full text-center text-3xl font-bold">Log In to Traq</h1>
        <!-- Navigate to register page if no account -->
        <a href="/register" class="mb-2 font-medium hover:underline">Don't have an account? Click here to Register.</a>

        <!-- Username/Email input -->
        <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Username or Email</p>
        <TextInput class="w-full" name="username" placeholder="johndoe@email.tld" autocomplete="username" />

        <!-- Password input -->
        <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Password</p>
        <TextInput class="w-full" name="password" placeholder="********" autocomplete="current-password" secret />

        <!-- Log in button -->
        <Button class="mt-5 w-full" variant={loading ? 'secondary' : 'default'}>
            {loading ? 'Loading...' : 'Log In'}
        </Button>

        <!-- Display error if specified -->
        {#if form?.error}
            <p class="mt-5 w-full text-center font-bold text-red-700">{form.error}</p>
        {/if}
    </form>

    <!-- Copyright footer -->
    <a class="w-full cursor-pointer text-center hover:underline" href="https://izmichael.com">
        &copy; IzMichael 2023 - izmichael.com
    </a>
</div>
