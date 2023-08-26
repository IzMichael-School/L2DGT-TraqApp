<script lang="ts">
    import { workspace, type Habit } from '$lib/pocketbase';
    import { poppedup } from '$lib/lib';

    import { createEventDispatcher } from 'svelte';
    import dayjs, { type Dayjs } from 'dayjs';

    import ProgressCircle from '$lib/ProgressCircle.svelte';
    import ContextMenu from '$lib/ContextMenu.svelte';
    import ContextMenuButton from '$lib/ContextMenuButton.svelte';

    export let habit: Habit, weekstart: Dayjs;
    let element: HTMLDivElement,
        menu: HTMLDivElement,
        showMenu = false;

    const dispatch = createEventDispatcher();

    async function setProgress(value: 0 | 1, day: number) {
        let date = dayjs(weekstart.add(day, 'day')).format('YYYY-MM-DD');
        if (!$workspace.habitlogs[date]) $workspace.habitlogs[date] = {};
        $workspace.habitlogs[date][habit.id] = value;
        console.log($workspace.habitlogs);
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
    class="group flex w-full flex-col items-center justify-start lg:h-[3.25rem] lg:flex-row"
    bind:this={element}
    on:contextmenu|preventDefault={() => {
        if (!$poppedup) (showMenu = true), ($poppedup = true);
    }}
>
    <button
        class="flex w-full cursor-pointer flex-row flex-wrap items-end justify-between pt-3 pb-1 text-left lg:w-1/2 lg:flex-col lg:flex-nowrap lg:items-start lg:justify-center lg:py-2"
        on:click={() => {
            dispatch('edit', { habit: habit });
        }}
    >
        <h4 class="h-6 text-base text-black lg:h-7 lg:text-xl lg:group-hover:text-lg">
            {habit.name}
        </h4>
        <p class="overflow-hidden text-sm italic text-black lg:h-0 lg:w-full lg:group-hover:mt-1 lg:group-hover:h-5">
            {habit.frequency.string}
            {habit.tags.length > 0 ? '-' : ''}
            {habit.tags.join(', ')}
        </p>
    </button>

    <div
        class="flex h-[2.25rem] w-full flex-row items-center justify-between lg:ml-5 lg:h-[3.25rem] lg:w-fit lg:flex-1 lg:justify-start lg:gap-5"
    >
        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
        {#each Array(7) as _i, i}
            {#if habit.frequency.days.includes(i) && dayjs(weekstart.add(i, 'day')).isAfter(dayjs(habit.frequency.start).subtract(1, 'day'), 'day')}
                <div
                    class="flex h-full flex-col items-center justify-center px-2 py-1 {dayjs().day() == i
                        ? 'border-x-2 border-zinc-500'
                        : ''}"
                    title={dayjs(weekstart.add(i, 'day')).format('dddd, DD MMMM')}
                >
                    <ProgressCircle
                        value={$workspace.habitlogs?.[dayjs(weekstart.add(i, 'day')).format('YYYY-MM-DD')]?.[habit.id]}
                        inactive={dayjs().day() > i}
                        on:click={() => {
                            if (dayjs().day() == i) setProgress(1, i);
                        }}
                        on:contextmenu={() => {
                            if (dayjs().day() == i) setProgress(0, i);
                        }}
                    />
                </div>
            {:else}
                <div class="h-full px-2 py-1 {dayjs().day() == i ? 'border-x-2 border-zinc-500' : ''}">
                    <span class="block h-0 w-7" />
                </div>
            {/if}
        {/each}
    </div>
</div>

{#if showMenu}
    <ContextMenu
        bind:element={menu}
        on:close={() => ((showMenu = false), ($poppedup = false))}
        anchor={{ x: element?.offsetLeft || 0, y: (element?.offsetTop || 0) + (element?.scrollHeight || 0) }}
    >
        {#if $workspace.habitlogs[dayjs().format('YYYY-MM-DD')][habit.id] != 0}
            <ContextMenuButton on:click={() => setProgress(0, dayjs().day())}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as Not Started</span>
            </ContextMenuButton>
        {/if}

        {#if $workspace.habitlogs[dayjs().format('YYYY-MM-DD')][habit.id] != 1}
            <ContextMenuButton on:click={() => setProgress(1, dayjs().day())}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as Complete</span>
            </ContextMenuButton>
        {/if}

        <div class="w-full border-b-2 border-gray-300" />

        <ContextMenuButton on:click={() => dispatch('edit', { habit: habit })}>
            <img src="/assets/icons/edit.svg" alt="Edit Icon" class="h-6 w-6" />
            <span>Edit Habit</span>
        </ContextMenuButton>

        <ContextMenuButton
            on:click={() => {
                if (!confirm('Are you sure you want to delete this habit?')) return;
                let ref = $workspace.habits.findIndex((a) => a.id == habit.id);
                if (ref > -1) {
                    $workspace.habits.splice(ref, 1);
                    // eslint-disable-next-line no-self-assign
                    $workspace.habits = $workspace.habits;
                }
            }}
        >
            <img src="/assets/icons/trash.svg" alt="Delete Icon" class="h-6 w-6" />
            <span>Delete Habit</span>
        </ContextMenuButton>
    </ContextMenu>
{/if}

<style>
    * {
        @apply transition-all duration-300 ease-in-out;
    }
</style>
