<script lang="ts">
    // Import Custom Components
    import Button from '$lib/Button.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';
    import TaskItem from '$lib/TaskItem.svelte';

    // Import libraries, stores, types
    import { workspace, type Task } from '$lib/pocketbase';
    import { multiSorter } from '$lib/lib';
    import { onMount } from 'svelte';

    // Declare Props
    export let value: string | undefined, valueFull: Task | undefined;

    // Declare Variable
    let showPicker = false;

    // Run on component load
    onMount(() => {
        // If value has been prefilled, find full task ref from value as id
        if (value && value.length > 0) {
            valueFull = $workspace.tasks.find((a) => a.id == value);
        }
    });
</script>

<!-- Button to open picker -->
<button class="contents" on:click={() => (showPicker = true)}>
    <!-- Slot filled on component usage, use custom button element when unspecified -->
    <slot>
        <Button variant="default">Open Task Picker</Button>
    </slot>
</button>

{#if showPicker}
    <!-- Dim the rest of the screen -->
    <ModalDimmer on:close={() => (showPicker = false)}>
        <div
            class="relative z-[110] flex h-full w-full flex-col items-center justify-start rounded-lg bg-white p-5 lg:h-2/3 lg:w-2/3"
        >
            <!-- Modal title -->
            <h1 class="mb-5 w-full text-center text-xl font-bold">Selecting Task</h1>

            <!-- Current value -->
            <p class="mb-1 w-full text-left text-sm text-zinc-700">Selected:</p>
            <div class="w-full rounded-md border-2 border-dashed border-zinc-300 p-1">
                <!-- If value specified, show task item, but disable interactivity and do not show subtasks, else display empty state -->
                {#if valueFull?.id}
                    <TaskItem task={valueFull} noninteractive nochildren />
                {:else}
                    <p class="flex h-11 flex-col items-start justify-center px-3">No Task Selected</p>
                {/if}
            </div>

            <!-- List tasks -->
            <p class="mt-5 mb-1 w-full text-left text-sm text-zinc-700">Options:</p>
            <div class="max-h-full w-full flex-1 overflow-auto">
                <!-- Button to select no task -->
                <Button
                    variant="outline"
                    class="mb-2 w-full"
                    on:click={() => ((value = undefined), (valueFull = undefined), (showPicker = false))}
                >
                    Select None
                </Button>
                <!-- Iterate over task list -->
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
