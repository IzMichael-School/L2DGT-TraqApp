<script lang="ts">
    // Import libraries, stores
    import { applyAction, enhance } from '$app/forms';
    import { pb } from '$lib/pocketbase';
    import { goto } from '$app/navigation';

    // Import active form data for progressive enchancement
    export let form;

    // Declare variables
    let password = '',
        loading = false;

    // Import custom components
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import PasswordStrength from '$lib/PasswordStrength.svelte';
</script>

<!-- Window Title -->
<svelte:head>
    <title>Register | Traq</title>
</svelte:head>

<div class="h-full max-h-full overflow-auto">
    <!-- Button to return to home page -->
    <button
        class="mx-auto mt-10 mb-5 flex flex-row items-center justify-start rounded-lg bg-brand-paleblue p-2 lg:absolute lg:top-0 lg:left-0 lg:mx-10"
        on:click={() => goto('/')}
    >
        <img
            src="/assets/icons/chevron-up.svg"
            alt="Arrow Pointing Left"
            class="aspect-square h-8 w-8 -rotate-90 rounded-lg invert"
        />
        <h1 class="mx-2 text-xl font-bold text-white lg:pb-1">Back to Home</h1>
        <img src="/favicon.png" alt="Traq Logo" class="aspect-square h-8 w-8 rounded-lg" />
    </button>

    <!-- Register form -->
    <form
        method="POST"
        class="mx-auto flex w-full flex-col items-center justify-center overflow-auto px-5 pt-5 lg:h-full lg:w-1/2"
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
        <h1 class="font-title mb-3 w-full text-center text-3xl font-bold">Register for Traq</h1>
        <!-- Navigate to login page if has account -->
        <a href="/login" class="mb-2 font-medium hover:underline">Already have an account? Click here to Log In.</a>

        <!-- Username input -->
        <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Username</p>
        <TextInput
            name="username"
            placeholder="JohnDoe12"
            autocomplete="username"
            subtitle="This must be unique."
            class="w-full"
            subtitleClass="w-full"
        />

        <!-- Email input -->
        <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Email Address</p>
        <TextInput
            name="email"
            placeholder="johndoe@email.tld"
            autocomplete="email"
            subtitle="This must be unique."
            class="w-full"
            subtitleClass="w-full"
        />

        <!-- Password input -->
        <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Password</p>
        <TextInput
            name="password"
            placeholder="********"
            autocomplete="new-password"
            subtitle="This must be between 8 and 72 characters, with no spaces."
            bind:value={password}
            class="w-full"
            subtitleClass="w-full mb-5"
            secret
        />

        <!-- Passwords strength checker -->
        <PasswordStrength bind:value={password} class="w-full" />

        <!-- Password confirmation -->
        <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Confirm Password</p>
        <TextInput
            name="passwordConfirm"
            placeholder="********"
            autocomplete="new-password"
            subtitle=""
            class="w-full"
            subtitleClass="w-full"
            secret
        />

        <!-- Register button -->
        <Button class="mt-5 w-full" variant={loading ? 'secondary' : 'default'}>
            {loading ? 'Loading...' : 'Register'}
        </Button>

        <!-- Display error if specified -->
        {#if form?.error}
            <p class="mt-5 w-full text-center font-bold text-red-700">{form.error}</p>
        {/if}
    </form>
</div>
