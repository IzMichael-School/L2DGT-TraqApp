<script lang="ts">
    // Import libraries, stores, types
    import { workspace, newTask, newTasklist, type Task, type Tasklist } from '$lib/pocketbase';
    import { flip } from 'svelte/animate';

    // Import custom components
    import TaskItem from '$lib/TaskItem.svelte';
    import TaskEditor from '$lib/TaskEditor.svelte';
    import TasklistEditor from '$lib/TasklistEditor.svelte';
    import Button from '$lib/Button.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';

    // Set page colour to blue
    import { color, multiSorter } from '$lib/lib';
    $color = 'blue';

    // Declare variables
    let editingTask: Task | undefined,
        editingTasklist: Tasklist | undefined,
        tasklistHeadings: {
            [key: string]: HTMLHeadingElement;
        } = {};
</script>

<!-- Set window title -->
<svelte:head>
    <title>Tasks | Traq</title>
</svelte:head>

<!-- Page title -->
<h2 class="-mb-1 text-2xl font-bold lg:mb-3 lg:text-4xl">My Tasks</h2>
{#if $workspace?.id}
    <!-- Iterate over each tasklist -->
    {#each $workspace.tasklists.sort((a, b) => (a.name > b.name ? 1 : -1)) as tasklist, i (tasklist.id)}
        <!-- Tasklist header -->
        <h2
            class="mb-1 pt-4 text-lg font-bold lg:mb-3 lg:text-2xl {i != 0 ? 'mt-4 lg:mt-12' : ''}"
            bind:this={tasklistHeadings[tasklist.id]}
        >
            {tasklist.name}
        </h2>
        <div id="tasks" class="contents">
            <!-- List each top-level task in tasklist using TaskItem component -->
            {#each $workspace.tasks
                .filter((t) => !t.parent && t.list == tasklist.id)
                .sort(multiSorter(['progress', 'duedate', 'name'])) as task (task.id)}
                <div animate:flip={{ delay: 400 }}>
                    <TaskItem {task} on:edit={(e) => (editingTask = structuredClone(e.detail.task))} />
                </div>
            {:else}
                <p class="mb-1">Looks like you don't have any tasks...</p>
            {/each}
        </div>
        <!-- Button to create new task -->
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
    {:else}
        <p class="mb-1">Looks like you don't have any task lists...</p>
    {/each}
{/if}

{#if $workspace?.id}
    <!-- Buttons to scroll jump to tasklists, hidden on mobile -->
    <div class="absolute top-0 right-0 flex w-[23rem] flex-col items-end justify-start gap-3 p-14 max-lg:hidden">
        {#each $workspace.tasklists.sort((a, b) => (a.name > b.name ? 1 : -1)) as tasklist}
            <Button
                variant="default"
                class="w-full"
                on:click={() => {
                    tasklistHeadings[tasklist.id]?.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start',
                        inline: 'start',
                    });
                }}
            >
                {tasklist.name}
            </Button>
        {/each}

        <!-- Button to create a task list, hidden on mobile -->
        <button
            class="flex w-full flex-row items-center justify-center rounded-lg p-2 text-gray-500 hover:bg-slate-200"
            on:click={() => {
                const newtasklist = newTasklist();
                editingTasklist = newtasklist;
            }}
        >
            <img
                src="/assets/icons/plus.svg"
                alt="Plus Icon"
                class="mr-2 aspect-square h-5 w-5 opacity-50 lg:h-7 lg:w-7"
            />
            <span class="mr-2 text-sm lg:text-base">Add a Task List</span>
        </button>
    </div>
{/if}

<!-- Button to create a task list, hidden on desktop -->
<button
    class="mt-5 flex w-full flex-row items-center justify-start rounded-lg p-2 text-gray-500 hover:bg-slate-200 lg:hidden"
    on:click={() => {
        const newtasklist = newTasklist();
        editingTasklist = newtasklist;
    }}
>
    <img src="/assets/icons/plus.svg" alt="Plus Icon" class="mr-2 aspect-square h-5 w-5 opacity-50 lg:h-7 lg:w-7" />
    <span class="mr-2 text-sm lg:text-base">Add a Task List</span>
</button>

<!-- Task editor -->
{#if editingTask?.id}
    <!-- Dim the screen -->
    <ModalDimmer on:close={() => (editingTask = undefined)}>
        <TaskEditor bind:task={editingTask} />
    </ModalDimmer>
{/if}

<!-- Task list editor -->
{#if editingTasklist?.id}
    <!-- Dim the screen -->
    <ModalDimmer on:close={() => (editingTasklist = undefined)}>
        <TasklistEditor bind:tasklist={editingTasklist} />
    </ModalDimmer>
{/if}

<style>
</style>
