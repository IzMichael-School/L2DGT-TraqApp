<script lang="ts">
    import { currentUser, workspace, type Task } from '$lib/pocketbase';
    import { poppedup, multiSorter } from '$lib/lib';

    import { createEventDispatcher } from 'svelte';
    import { flip } from 'svelte/animate';
    import dayjs from 'dayjs';

    import ProgressCircle from '$lib/ProgressCircle.svelte';
    import TaskItem from '$lib/TaskItem.svelte';
    import ContextMenu from '$lib/ContextMenu.svelte';
    import ContextMenuButton from '$lib/ContextMenuButton.svelte';

    export let task: Task,
        noninteractive = false,
        nochildren = false;
    let element: HTMLDivElement,
        menu: HTMLDivElement,
        showMenu = false;

    const dispatch = createEventDispatcher();

    async function setProgress(value: 0 | 0.5 | 1 | number) {
        $workspace.tasks = $workspace.tasks.sort((a, b) => (a.id > b.id ? 1 : -1));
        let ref = $workspace.tasks.findIndex((a) => a.id == task.id);
        if (ref > -1) $workspace.tasks[ref].progress = value as 0 | 0.5 | 1;
        task.progress = value as 0 | 0.5 | 1;
    }
</script>

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

    <button
        class="flex flex-1 cursor-pointer flex-col items-start justify-center text-left"
        on:click={() => {
            if (noninteractive) return false;
            dispatch('edit', { task: task });
        }}
    >
        <h4
            class="h-6 text-base group-hover:text-sm lg:h-7 lg:text-xl lg:group-hover:text-lg {task.progress == 1
                ? 'text-brand-lightgrey line-through'
                : 'text-black'}"
        >
            {task.name}
        </h4>
        <p
            class="h-0 w-full overflow-hidden text-xs italic group-hover:h-4 max-lg:mb-1 lg:text-sm lg:group-hover:mt-1 lg:group-hover:h-5 {task.progress ==
            1
                ? 'text-brand-lightgrey line-through'
                : 'text-black'}"
        >
            Due: {dayjs(task.duedate).format($currentUser.preferences.dateFormat)}
        </p>
    </button>
</div>

{#if showMenu}
    <ContextMenu
        bind:element={menu}
        on:close={() => ((showMenu = false), ($poppedup = false))}
        anchor={{ x: element?.offsetLeft || 0, y: (element?.offsetTop || 0) + (element?.scrollHeight || 0) }}
    >
        {#if task.progress != 0}
            <ContextMenuButton on:click={() => setProgress(0)}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as Not Started</span>
            </ContextMenuButton>
        {/if}

        {#if task.progress != 0.5}
            <ContextMenuButton on:click={() => setProgress(0.5)}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as In Progress</span>
            </ContextMenuButton>
        {/if}

        {#if task.progress != 1}
            <ContextMenuButton on:click={() => setProgress(1)}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as Complete</span>
            </ContextMenuButton>
        {/if}

        <div class="w-full border-b-2 border-gray-300" />

        <ContextMenuButton on:click={() => dispatch('edit', { task: task })}>
            <img src="/assets/icons/edit.svg" alt="Edit Icon" class="h-6 w-6" />
            <span>Edit Task</span>
        </ContextMenuButton>

        <ContextMenuButton
            on:click={() => {
                if (!confirm('Are you sure you want to delete this task?')) return;
                let ref = $workspace.tasks.findIndex((a) => a.id == task.id);
                if (ref > -1) {
                    $workspace.tasks.splice(ref, 1);
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

{#if !nochildren}
    <div class="w-full pl-4 lg:pl-8">
        {#each $workspace.tasks
            .filter((t) => t.parent == task.id)
            .sort(multiSorter(['progress', 'duedate', 'name'])) as subtask (subtask.id)}
            <div animate:flip={{ delay: 400 }}>
                <TaskItem task={subtask} on:edit={(e) => dispatch('edit', e.detail)} />
            </div>
        {/each}
    </div>
{/if}

<style>
    * {
        @apply transition-all duration-300 ease-in-out;
    }
</style>
