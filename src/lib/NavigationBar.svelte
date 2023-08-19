<script lang="ts">
    import SidebarTab from '$lib/SidebarTab.svelte';
    import { fade } from 'svelte/transition';
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { saving } from '$lib/pocketbase';
</script>

<div
    class="flex h-16 w-full flex-row items-center justify-start bg-brand-paleblue lg:h-full lg:w-32 lg:flex-col"
    id="sidebar"
>
    <button
        class="aspect-square shrink-0 overflow-hidden rounded-br-3xl bg-brand-paleblue max-lg:h-full lg:w-full"
        on:click={() => goto('/app')}
    >
        <img src="/favicon.png" alt="Traq Logo" class="aspect-square w-full" />
    </button>

    <SidebarTab
        colorname="blue"
        icon="checks.svg"
        label="Tasks"
        on:click={() => goto('/app/tasks')}
        active={$page.route.id?.includes('/app/tasks')}
    />
    <SidebarTab
        colorname="red"
        icon="calendar-time.svg"
        label="Habits"
        on:click={() => goto('/app/habits')}
        active={$page.route.id?.includes('/app/habits')}
    />

    <div class="flex-1 overflow-hidden max-lg:h-0 lg:w-0" />

    {#if $saving != false}
        <div
            class="flex w-full flex-row items-center justify-between gap-2 p-3 text-white"
            transition:fade={{ duration: 300 }}
        >
            {#if $saving == 'working'}
                <div class="aspect-square h-7 w-7 animate-spin">
                    <img
                        src="/assets/icons/refresh.svg"
                        alt="Syncing Icon"
                        class="aspect-square h-7 w-7 -scale-x-100 invert"
                    />
                </div>
                <p class="hidden lg:block">Saving...</p>
            {:else if $saving == 'failed'}
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
