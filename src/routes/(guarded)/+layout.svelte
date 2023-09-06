<script lang="ts">
    // Import libraries, types, stores
    import { fade } from 'svelte/transition';
    import { color, colors } from '$lib/lib';

    // Import custom components
    import NavigationBar from '$lib/NavigationBar.svelte';

    // Import current path as layout data from +layout.server.ts
    export let data: {
        currentPath: string;
    };
</script>

<div
    class="flex h-screen w-screen flex-col items-center justify-start overflow-hidden overscroll-none bg-brand-paleblue font-lexend lg:flex-row"
>
    <!-- Add navigation bar -->
    <NavigationBar />

    <!-- Wrapper for 0.25rem coloured border around page -->
    <div
        class="flex max-h-full max-w-full flex-1 flex-col items-center justify-start overflow-hidden p-1 transition-colors duration-300 ease-in-out max-lg:w-full max-lg:rounded-t-[1.75rem] lg:h-full lg:rounded-l-[1.75rem]"
        style="background-color: {colors[$color]};"
    >
        <!-- Off-white bg for main page -->
        <div
            class="max-h-full w-full max-w-full flex-1 overflow-hidden bg-slate-100 max-lg:rounded-t-3xl lg:rounded-l-3xl"
        >
            <!-- When current path changes, re-render component -->
            {#key data.currentPath}
                <!-- Wrapper to handle fade animations between pages -->
                <div
                    class="h-full max-h-full w-full max-w-full overflow-auto p-3 lg:p-7"
                    in:fade={{ duration: 300, delay: 300 }}
                    out:fade={{ duration: 300 }}
                >
                    <!-- Fill content of page -->
                    <slot />
                </div>
            {/key}
        </div>
        <!-- Copyright footer -->
        <a
            class="w-full shrink-0 cursor-pointer pt-1 text-right text-xs font-bold text-white hover:underline"
            href="https://izmichael.com"
        >
            &copy; IzMichael 2023 - izmichael.com
        </a>
    </div>
</div>

<style>
    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 4px;
    }
    ::-webkit-scrollbar-track {
        background: transparent;
    }
    ::-webkit-scrollbar-thumb {
        background: rgb(113, 113, 122);
    }
    ::-webkit-scrollbar-thumb:hover {
        background: rgb(63, 63, 70);
    }
</style>
