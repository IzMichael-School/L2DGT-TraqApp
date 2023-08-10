<script lang="ts">
    import { currentUser, workspace, type Task } from '$lib/pocketbase';
    import { poppedup } from '$lib/lib';

    import { createEventDispatcher } from 'svelte';
    import dayjs from 'dayjs';

    import TaskItem from '$lib/TaskItem.svelte';
    import ContextMenu from '$lib/ContextMenu.svelte';
    import ContextMenuButton from '$lib/ContextMenuButton.svelte';

    export let task: Task;
    let element: HTMLDivElement,
        menu: HTMLDivElement,
        showMenu = false;

    const dispatch = createEventDispatcher();

    async function setProgress(value: 0 | 0.5 | 1) {
        let ref = $workspace.tasks.findIndex((a) => a.id == task.id);
        if (ref > -1) $workspace.tasks[ref].progress = value;
        task.progress = value;
    }
</script>

<svelte:window
    on:mousedown={(e) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next-line
        if (element && menu && !element.contains(e.target) && !menu.contains(e.target))
            (showMenu = false), ($poppedup = false);
    }}
/>

<div
    class="group my-1 flex h-11 w-full cursor-pointer flex-row items-center justify-start gap-3 px-2 py-1"
    bind:this={element}
    on:contextmenu|preventDefault={() => {
        if (!$poppedup) (showMenu = true), ($poppedup = true);
    }}
>
    <button
        on:click={() => setProgress(1)}
        on:contextmenu|preventDefault|stopPropagation={() => setProgress(0.5)}
        class="flex aspect-square h-7 w-7 flex-row items-center justify-start overflow-hidden rounded-full border-2 {task.progress ==
        1
            ? 'border-brand-lightgrey'
            : 'border-black'}"
    >
        <span
            class="block h-full {task.progress == 1 ? 'bg-brand-lightgrey' : 'bg-black'}"
            style="width: {task.progress * 100}%;"
        />
    </button>

    <button class="flex flex-1 flex-col items-start justify-center" on:click={() => dispatch('edit', { task: task })}>
        <h4 class="h-7 text-xl group-hover:text-lg {task.progress == 1 ? 'text-brand-lightgrey' : 'text-black'}">
            {task.name}
        </h4>
        <p class="h-0 overflow-hidden text-sm italic group-hover:mt-1 group-hover:h-5">
            Due: {dayjs(task.duedate).format($currentUser.preferences.dateFormat)}
            {task.tags.length > 0 ? '-' : ''}
            {task.tags.join(', ')}
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

<div class="pl-8">
    {#each $workspace.tasks.filter((t) => t.parent == task.id) as subtask}
        <TaskItem task={subtask} on:edit={(e) => dispatch('edit', e.detail)} />
    {/each}
</div>

<style>
    * {
        @apply transition-all duration-300 ease-in-out;
    }
</style>
