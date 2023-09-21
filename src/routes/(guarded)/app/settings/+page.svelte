<script lang="ts">
    // Set page colour to red
    import { color } from '$lib/lib';
    $color = 'green';

    // Import dayjs library
    import dayjs from 'dayjs';

    // Import components
    import TextInput from '$lib/TextInput.svelte';
    import Button from '$lib/Button.svelte';

    // Declare variables, import database library
    import { pb, currentUser, type User } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    let profile: User = {} as User,
        profileSaving = false,
        errormsg = '',
        verificationSent = false,
        passwordReset = false;

    onMount(() => {
        profile = structuredClone($currentUser);
    });
</script>

<!-- Set Window Title -->
<svelte:head>
    <title>Settings | Traq</title>
</svelte:head>

<!-- Page title -->
<h2 class="mb-3 text-2xl font-bold lg:mb-7 lg:text-4xl">Settings</h2>

<div class="mt-4 w-full rounded-xl bg-white p-2 pl-4 shadow-lg lg:mt-4 lg:px-5 lg:pt-4 lg:pb-5">
    <!-- Section title -->
    <h2 class="mb-1 text-lg font-bold lg:mb-4 lg:text-2xl">Profile</h2>

    <!-- Username input -->
    <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Username</p>
    <TextInput
        class="w-full"
        name="username"
        placeholder="JohnDoe12"
        autocomplete="username"
        bind:value={profile.username}
    />

    <!-- Date format selector -->
    <p class="ml-1 mt-5 mb-1 w-full text-left text-base font-semibold text-black">Preferred Date Format</p>
    <select class="w-full rounded-lg bg-gray-100 p-2" bind:value={profile.dateFormat}>
        <option value="DD/MM/YYYY HH:mm">DD/MM/YYYY HH:mm ({dayjs().format('DD/MM/YYYY HH:mm')})</option>
        <option value="DD/MM/YYYY hh:mm a">DD/MM/YYYY hh:mm a ({dayjs().format('DD/MM/YYYY hh:mm a')})</option>
        <option value="dddd, DD MMMM YYYY - HH:mm">
            dddd, DD MMMM YYYY - HH:mm ({dayjs().format('dddd, DD MMMM YYYY - HH:mm')})
        </option>
        <option value="dddd, DD MMMM YYYY - hh:mm a">
            dddd, DD MMMM YYYY - hh:mm a ({dayjs().format('dddd, DD MMMM YYYY - hh:mm a')})
        </option>
    </select>

    <div class="mt-5 flex w-full flex-row items-center justify-end">
        <Button
            class="px-10"
            variant={profileSaving ? 'secondary' : 'default'}
            on:click={async () => {
                if (profileSaving) return;
                profileSaving = true;
                if (profile.username.length < 5) {
                    profileSaving = false;
                    errormsg = 'Username cannot be shorter than 5 characters';
                    return;
                }
                if (profile.username.length > 32) {
                    profileSaving = false;
                    errormsg = 'Username cannot be longer than 32 characters';
                    return;
                }
                await pb.collection('users').update(profile.id, profile);
                errormsg = '';
                profileSaving = false;
            }}
        >
            {profileSaving ? 'Saving...' : 'Save Changes'}
        </Button>
    </div>
    {#if errormsg.length > 0}
        <p class="mt-1 w-full text-right text-red-500">{errormsg}</p>
    {/if}
</div>

<div class="mt-4 w-full rounded-xl bg-white p-2 pl-4 shadow-lg lg:mt-4 lg:px-5 lg:pt-4 lg:pb-5">
    <!-- Section title -->
    <h2 class="mb-1 text-lg font-bold lg:mb-4 lg:text-2xl">Account</h2>

    {#if !$currentUser?.verified}
        <div
            class="mb-4 flex w-full flex-row items-center justify-start rounded-xl bg-yellow-400 p-2 text-black shadow-md lg:px-5 lg:py-2"
        >
            <span class="mr-2 text-4xl font-bold lg:mr-5">!</span>
            <div class="flex flex-1 flex-col items-start justify-center">
                <h2 class="text-lg font-bold">Your email is not verified</h2>
                <p class="text-sm">You will not be able to change your password until you verify.</p>
                <Button
                    on:click={async () => {
                        if (verificationSent) return;
                        pb.collection('users').requestVerification($currentUser.email);
                        verificationSent = true;
                    }}
                    class="mt-3 w-full bg-yellow-300 hover:bg-yellow-200"
                    variant="unstyled"
                >
                    {verificationSent ? 'Done! Check your email inbox.' : 'Resend Verification Email'}
                </Button>
            </div>
        </div>
    {/if}

    <!-- Email input -->
    <p class="ml-1 mt-5 w-full text-left text-base font-semibold text-black">Email</p>
    <div class="flex w-full flex-row items-center justify-between rounded-lg bg-gray-100 p-2">
        {profile.email ?? ''}
    </div>
    <p class="mt-1 ml-1 text-sm text-gray-500">Email cannot be changed.</p>

    <!-- Password input -->
    <Button
        class="mt-5 w-full px-10"
        variant={passwordReset ? 'secondary' : 'default'}
        on:click={async () => {
            await pb.collection('users').requestPasswordReset(profile.email);
            passwordReset = true;
        }}
    >
        <!-- TODO: Error when email is unverified -->
        {passwordReset ? 'Done! Check your email inbox to change your password.' : 'Change my Password'}
    </Button>
</div>

<style>
</style>
