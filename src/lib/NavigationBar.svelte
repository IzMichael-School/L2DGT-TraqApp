<script lang="ts">
    // Import navigation buttons
    import NavigationButton from '$lib/NavigationButton.svelte';

    // Import Library packages
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { saving } from '$lib/pocketbase';
</script>

<div
    class="flex h-16 w-full flex-row items-center justify-start bg-brand-paleblue lg:h-full lg:w-32 lg:flex-col"
    id="sidebar"
>
    <!-- Logo Button, navigates to dashboard -->
    <button
        class="aspect-square shrink-0 overflow-hidden rounded-br-3xl bg-brand-paleblue max-lg:h-full lg:w-full"
        on:click={() => goto('/app')}
    >
        <img src="/favicon.png" alt="Traq Logo" class="aspect-square w-full" />
    </button>

    <!-- Nav Button for Tasks List -->
    <NavigationButton
        colorname="blue"
        icon="checks.svg"
        label="Tasks"
        on:click={() => goto('/app/tasks')}
        active={$page.route.id?.includes('/app/tasks')}
    />
    <!-- Nav Button for Habits List -->
    <NavigationButton
        colorname="red"
        icon="calendar-time.svg"
        label="Habits"
        on:click={() => goto('/app/habits')}
        active={$page.route.id?.includes('/app/habits')}
    />
    <!-- Nav Button for Settings -->
    <NavigationButton
        colorname="green"
        icon="gear.svg"
        label="Settings"
        on:click={() => goto('/app/settings')}
        active={$page.route.id?.includes('/app/settings')}
    />
    <!-- Button to Logout -->
    <NavigationButton colorname="lightgrey" icon="logout.svg" label="Logout" on:click={() => goto('/logout')} />

    <!-- Spacer to push the save indicator to the bottom -->
    <div class="flex-1 overflow-hidden max-lg:h-0 lg:w-0" />

    {#if $saving != false}
        <div
            class="flex w-full flex-row items-center justify-between gap-2 p-3 text-white"
            transition:fade={{ duration: 300 }}
        >
            {#if $saving == 'working'}
                <!-- Show Saving Indicator during DB push -->
                <div class="aspect-square h-7 w-7 animate-spin">
                    <img
                        src="/assets/icons/refresh.svg"
                        alt="Syncing Icon"
                        class="aspect-square h-7 w-7 -scale-x-100 invert"
                    />
                </div>
                <p class="hidden lg:block">Saving...</p>
            {:else if $saving == 'failed'}
                <!-- Show Failed Indicator if DB connection fails -->
                <div class="aspect-square h-7 w-7 animate-pulse">
                    <img
                        src="/assets/icons/refresh-alert.svg"
                        alt="Sync Failed Icon"
                        class="aspect-square h-7 w-7 -scale-x-100 invert"
                    />
                </div>
                <p class="hidden lg:block">Failed</p>
            {/if}
        </div>
    {/if}
</div>

<style>
</style>
