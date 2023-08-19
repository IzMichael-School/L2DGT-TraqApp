<script lang="ts">
    import Button from '$lib/Button.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';
    import TaskItem from '$lib/TaskItem.svelte';

    import { workspace, type Task } from '$lib/pocketbase';
    import { multiSorter } from '$lib/lib';
    import { onMount } from 'svelte';
    export let value: string | undefined, valueFull: Task | undefined;

    let showPicker = false;
    onMount(() => {
        if (value && value.length > 0) {
            valueFull = $workspace.tasks.find((a) => a.id == value);
        }
    });
</script>

<button class="contents" on:click={() => (showPicker = true)}>
    <slot>
        <Button variant="default">Open Task Picker</Button>
    </slot>
</button>

{#if showPicker}
    <ModalDimmer on:close={() => (showPicker = false)}>
        <div
            class="relative z-[110] flex h-full w-full flex-col items-center justify-start rounded-lg bg-white p-5 lg:h-2/3 lg:w-2/3"
        >
            <h1 class="mb-5 w-full text-center text-xl font-bold">Selecting Task</h1>
            <p class="mb-1 w-full text-left text-sm text-zinc-700">Selected:</p>
            <div class="w-full rounded-md border-2 border-dashed border-zinc-300 p-1">
                {#if valueFull?.id}
                    <TaskItem task={valueFull} noninteractive nochildren />
                {:else}
                    <p class="flex h-11 flex-col items-start justify-center px-3">No Task Selected</p>
                {/if}
            </div>

            <p class="mt-5 mb-1 w-full text-left text-sm text-zinc-700">Options:</p>
            <div class="max-h-full w-full flex-1 overflow-auto">
                <Button
                    variant="outline"
                    class="mb-2 w-full"
                    on:click={() => ((value = undefined), (valueFull = undefined), (showPicker = false))}
                >
                    Select None
                </Button>
                {#each $workspace.tasks.sort(multiSorter(['progress', 'duedate', 'name'])) as task}
                    <button
                        class="contents"
                        on:click={() => ((value = task.id), (valueFull = task), (showPicker = false))}
                    >
                        <TaskItem {task} noninteractive nochildren />
                    </button>
                {/each}
            </div>
        </div>
    </ModalDimmer>
{/if}

<style>
</style>
