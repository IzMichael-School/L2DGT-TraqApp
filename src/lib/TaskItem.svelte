<script lang="ts">
    // Import libraries, stores, types
    import { currentUser, workspace, type Task } from '$lib/pocketbase';
    import { poppedup, multiSorter } from '$lib/lib';
    import { flip } from 'svelte/animate';
    import dayjs from 'dayjs';

    // Create dispatcher for click events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Import custom components
    import ProgressCircle from '$lib/ProgressCircle.svelte';
    import TaskItem from '$lib/TaskItem.svelte';
    import ContextMenu from '$lib/ContextMenu.svelte';
    import ContextMenuButton from '$lib/ContextMenuButton.svelte';

    // Declare Props
    export let task: Task,
        noninteractive = false,
        nochildren = false;

    // Declare variables
    let element: HTMLDivElement,
        menu: HTMLDivElement,
        showMenu = false;

    // Set the progress value on the task
    async function setProgress(value: 0 | 0.5 | 1 | number) {
        // Sort the list of tasks, helps with finding the index ref
        $workspace.tasks = $workspace.tasks.sort((a, b) => (a.id > b.id ? 1 : -1));
        // Get the index ref of the task
        let ref = $workspace.tasks.findIndex((a) => a.id == task.id);
        // If ref found, set progress to value from args
        if (ref > -1) $workspace.tasks[ref].progress = value as 0 | 0.5 | 1;
        // Set local task variable progress to value from args
        task.progress = value as 0 | 0.5 | 1;
        // Update statistics
        if (value == 1) $workspace.statistics.tasks.completed++;
    }
</script>

<!-- Binding to the DOM, used to close context menu when clicking out of it -->
<svelte:window
    on:mousedown={(e) => {
        if (noninteractive) return false;
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next-line
        if (element && menu && !element.contains(e.target) && !menu.contains(e.target))
            (showMenu = false), ($poppedup = false);
    }}
/>

<div
    class="group my-1 flex h-11 w-full flex-row items-center justify-start gap-3 py-1 px-2"
    bind:this={element}
    on:contextmenu|preventDefault={() => {
        if (noninteractive) return false;
        if (!$poppedup) (showMenu = true), ($poppedup = true);
    }}
>
    <!-- Progress circle, interactively change progress value, represents progress in increments of 50% -->
    <ProgressCircle
        bind:value={task.progress}
        on:click={() => {
            if (noninteractive) return false;
            if (task.progress < 1) setProgress((task.progress += 0.5));
        }}
        on:contextmenu={() => {
            if (noninteractive) return false;
            if (task.progress > 0) setProgress((task.progress -= 0.5));
        }}
    />

    <!-- Task details, edits task on click -->
    <button
        class="flex flex-1 cursor-pointer flex-col items-start justify-center text-left"
        on:click={() => {
            if (noninteractive) return false;
            dispatch('edit', { task: task });
        }}
    >
        <!-- Task name -->
        <h4
            class="h-6 text-base group-hover:text-sm lg:h-7 lg:text-xl lg:group-hover:text-lg {task.progress == 1
                ? 'text-brand-lightgrey line-through'
                : 'text-black'}"
        >
            {task.name}
        </h4>
        <!-- Task due date, only shown on parent hover -->
        <p
            class="h-0 w-full overflow-hidden text-xs italic group-hover:h-4 max-lg:mb-1 lg:text-sm lg:group-hover:mt-1 lg:group-hover:h-5 {task.progress ==
            1
                ? 'text-brand-lightgrey line-through'
                : 'text-black'}"
        >
            Due: {task.duedate ? dayjs(task.duedate).format($currentUser.dateFormat) : 'Unset'}
        </p>
    </button>
</div>

{#if showMenu}
    <!-- Context menu, used to mark progress, edit, and delete the tasj -->
    <ContextMenu
        bind:element={menu}
        on:close={() => ((showMenu = false), ($poppedup = false))}
        anchor={{ x: element?.offsetLeft || 0, y: (element?.offsetTop || 0) + (element?.scrollHeight || 0) }}
    >
        {#if task.progress != 0}
            <!-- Mark as not started button -->
            <ContextMenuButton on:click={() => setProgress(0)}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as Not Started</span>
            </ContextMenuButton>
        {/if}

        {#if task.progress != 0.5}
            <!-- Mark as in-progress button -->
            <ContextMenuButton on:click={() => setProgress(0.5)}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as In Progress</span>
            </ContextMenuButton>
        {/if}

        {#if task.progress != 1}
            <!-- Mark as completed button -->
            <ContextMenuButton on:click={() => setProgress(1)}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as Complete</span>
            </ContextMenuButton>
        {/if}

        <!-- Separator line -->
        <div class="w-full border-b-2 border-gray-300" />

        <!-- Edit button -->
        <ContextMenuButton on:click={() => dispatch('edit', { task: task })}>
            <img src="/assets/icons/edit.svg" alt="Edit Icon" class="h-6 w-6" />
            <span>Edit Task</span>
        </ContextMenuButton>

        <!-- Delete button -->
        <ContextMenuButton
            on:click={() => {
                if (!confirm('Are you sure you want to delete this task?')) return;
                // Find index of task
                let ref = $workspace.tasks.findIndex((a) => a.id == task.id);
                // If found...
                if (ref > -1) {
                    // remove from list
                    $workspace.tasks.splice(ref, 1);
                    // Trigger Svelte's reactivity
                    // eslint-disable-next-line no-self-assign
                    $workspace.tasks = $workspace.tasks;
                }
            }}
        >
            <img src="/assets/icons/trash.svg" alt="Delete Icon" class="h-6 w-6" />
            <span>Delete Task</span>
        </ContextMenuButton>
    </ContextMenu>
{/if}

<!-- If component args specify displaying subtasks -->
{#if !nochildren}
    <div class="w-full pl-4 lg:pl-8">
        <!-- List each subtask, as separate TaskItem component -->
        {#each $workspace.tasks
            .filter((t) => t.parent == task.id)
            .sort(multiSorter(['progress', 'duedate', 'name'])) as subtask (subtask.id)}
            <!-- Enclosing div used for sort animation -->
            <div animate:flip={{ delay: 400 }}>
                <TaskItem task={subtask} on:edit={(e) => dispatch('edit', e.detail)} />
            </div>
        {/each}
    </div>
{/if}

<style>
    /* Add transition to all elements */
    * {
        @apply transition-all duration-300 ease-in-out;
    }
</style>
