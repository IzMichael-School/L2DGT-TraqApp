<script lang="ts">
    import { workspace, newTask, type Task } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    import { flip } from 'svelte/animate';

    import TaskItem from '$lib/TaskItem.svelte';
    import TaskEditor from '$lib/TaskEditor.svelte';
    import Button from '$lib/Button.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';

    import { color, multiSorter } from '$lib/lib';
    $color = 'blue';

    let editingTask: Task | undefined;

    onMount(async () => {
        $workspace.tasklists.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
</script>

<h2 class="mb-3 text-2xl font-bold lg:mb-7 lg:text-4xl">My Tasks</h2>
{#if $workspace?.id}
    {#each $workspace.tasklists as tasklist, i (tasklist.id)}
        <h2 class="mb-1 text-lg font-bold lg:mb-3 lg:text-2xl {i != 0 ? 'mt-8 lg:mt-16' : ''}">{tasklist.name}</h2>
        {#each $workspace.tasks
            .filter((t) => !t.parent && t.list == tasklist.id)
            .sort(multiSorter(['progress', 'duedate', 'name'])) as task (task.id)}
            <div animate:flip={{ delay: 400 }}>
                <TaskItem {task} on:edit={(e) => (editingTask = structuredClone(e.detail.task))} />
            </div>
        {:else}
            <p class="mb-1">Looks like you don't have any tasks...</p>
        {/each}
        <button
            class="flex flex-row items-center justify-start rounded-lg p-2 text-gray-500 hover:bg-slate-200"
            on:click={() => {
                const newtask = newTask({
                    list: tasklist.id,
                });
                editingTask = newtask;
            }}
        >
            <img
                src="/assets/icons/plus.svg"
                alt="Plus Icon"
                class="mr-2 aspect-square h-5 w-5 opacity-50 lg:h-7 lg:w-7"
            />
            <span class="mr-2 text-sm lg:text-base">Add a Task</span>
        </button>
    {/each}
{/if}

{#if $workspace?.id}
    <div class="absolute top-0 right-0 m-14 flex w-48 flex-col items-end justify-start gap-3 max-lg:hidden">
        {#each $workspace.tasklists as tasklist}
            <Button variant="default" class="w-full">{tasklist.name}</Button>
        {/each}
    </div>
{/if}

{#if editingTask?.id}
    <ModalDimmer on:close={() => (editingTask = undefined)}>
        <TaskEditor bind:task={editingTask} />
    </ModalDimmer>
{/if}

<style>
</style>
