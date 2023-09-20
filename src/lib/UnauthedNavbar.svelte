<script lang="ts">
    // Import navigation library
    import { goto } from '$app/navigation';
</script>

<div class="mx-auto mb-5 w-full px-5 py-5 lg:px-0">
    <div
        class="flex h-fit w-full flex-row items-center justify-between rounded-lg border-2 bg-zinc-50 text-black shadow-lg lg:justify-center"
    >
        <button class="flex flex-1 flex-row items-center justify-start p-2" on:click={() => goto('/')}>
            <img
                src="/assets/icons/chevron-up.svg"
                alt="Arrow Pointing Left"
                class="aspect-square h-5 w-5 -rotate-90 rounded-lg"
            />
            <h1 class="mx-2 lg:pb-1">Back to Home</h1>
        </button>

        <img src="/favicon.png" alt="Traq Logo" class="aspect-square h-8 w-8 rounded-lg" />
        <h1 class="mx-2 text-xl font-bold lg:pb-1">Traq</h1>

        <span class="hidden flex-1 lg:block" />
    </div>
</div>

<style>
</style>
