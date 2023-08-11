<script lang="ts">
    import { applyAction, enhance } from '$app/forms';
    import { pb } from '$lib/pocketbase';

    export let form;
    import Button from '$lib/Button.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import PasswordStrength from '$lib/PasswordStrength.svelte';

    let password = '',
        loading = false;
</script>

<form
    method="POST"
    class="flex h-full w-full flex-col items-center justify-start px-5 pt-5"
    use:enhance={() => {
        return async ({ result }) => {
            pb.authStore.loadFromCookie(document.cookie);
            await applyAction(result);
            loading = false;
        };
    }}
    on:submit={() => (loading = true)}
>
    <h1 class="font-title mb-3 w-full text-center text-3xl font-bold">Register for Traq</h1>
    <a href="/login" class="mb-2 font-medium hover:underline">Already have an account? Click here to Log In.</a>

    <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Username</p>
    <TextInput
        name="username"
        placeholder="JohnDoe12"
        autocomplete="username"
        subtitle="This must be unique."
        class="w-full"
        subtitleClass="w-full"
    />

    <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Email Address</p>
    <TextInput
        name="email"
        placeholder="johndoe@email.tld"
        autocomplete="email"
        subtitle="This must be unique."
        class="w-full"
        subtitleClass="w-full"
    />

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

    <PasswordStrength bind:value={password} class="w-full" />

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
    <Button class="mt-5 w-full" variant={loading ? 'secondary' : 'default'}>
        {loading ? 'Loading...' : 'Register'}
    </Button>

    {#if form?.error}
        <p class="mt-5 w-full text-center font-bold text-red-700">{form.error}</p>
    {/if}
</form>
