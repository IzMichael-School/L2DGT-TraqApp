<script lang="ts">
    import { workspace, newTask, type Task } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    import TaskItem from '$lib/TaskItem.svelte';
    import TaskEditor from '$lib/TaskEditor.svelte';
    import Button from '$lib/Button.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';

    let editingTask: Task | undefined;

    onMount(async () => {
        $workspace.tasklists.sort((a, b) => (a.name > b.name ? 1 : -1));
        $workspace.tasks.sort((a, b) => (a.duedate || a.name > b.duedate || b.name ? 1 : -1));
    });
</script>

{#if $workspace?.id}
    {#each $workspace.tasklists as tasklist, i (tasklist.id)}
        <h2 class="mb-3 text-3xl font-bold {i != 0 ? 'mt-16' : ''}">{tasklist.name}</h2>
        {#each $workspace.tasks.filter((t) => !t.parent && t.list == tasklist.id) as task (task.id)}
            <TaskItem {task} on:edit={(e) => (editingTask = structuredClone(e.detail.task))} />
        {:else}
            <h3>Looks like you don't have any tasks...</h3>
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
            <img src="/assets/icons/plus.svg" alt="Plus Icon" class="mr-2 h-7 w-7 opacity-50" />
            <span class="mr-2">Add a Task</span>
        </button>
    {/each}
{/if}

{#if $workspace?.id}
    <div class="absolute top-0 right-0 m-14 flex w-48 flex-col items-end justify-start gap-3">
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
