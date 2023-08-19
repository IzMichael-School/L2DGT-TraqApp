<script lang="ts">
    import { fade } from 'svelte/transition';
    import { color, colors } from '$lib/lib';
    import NavigationBar from '$lib/NavigationBar.svelte';
    export let data: {
        currentPath: string;
    };
</script>

<div
    class="flex h-screen w-screen flex-col items-center justify-start overflow-hidden overscroll-none bg-brand-paleblue font-lexend lg:flex-row"
>
    <NavigationBar />

    <div
        class="max-h-full max-w-full flex-1 overflow-hidden p-1 transition-colors duration-300 ease-in-out max-lg:w-full max-lg:rounded-t-[1.75rem] lg:h-full lg:rounded-l-[1.75rem]"
        style="background-color: {colors[$color]};"
    >
        <div
            class="h-full max-h-full w-full max-w-full overflow-hidden bg-slate-100 max-lg:rounded-t-3xl lg:rounded-l-3xl"
        >
            {#key data.currentPath}
                <div
                    class="h-full max-h-full w-full max-w-full overflow-auto p-5 lg:p-7"
                    in:fade={{ duration: 300, delay: 300 }}
                    out:fade={{ duration: 300 }}
                >
                    <slot />
                </div>
            {/key}
        </div>
    </div>
</div>

<style>
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
