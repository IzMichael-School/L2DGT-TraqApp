<script lang="ts">
    // Import libraries, stores, types
    import { workspace, type Habit } from '$lib/pocketbase';
    import { poppedup } from '$lib/lib';
    import dayjs, { type Dayjs } from 'dayjs';

    // Create dispatcher for click events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Import custom components
    import ProgressCircle from '$lib/ProgressCircle.svelte';
    import ContextMenu from '$lib/ContextMenu.svelte';
    import ContextMenuButton from '$lib/ContextMenuButton.svelte';

    // Declare Props
    export let habit: Habit,
        weekstart: Dayjs,
        single = false,
        dayofweek = 0;

    // Declare variables
    let element: HTMLDivElement,
        menu: HTMLDivElement,
        showMenu = false;

    // Set the progress value on the habit
    async function setProgress(value: 0 | 1, day: number) {
        // Get the date of the specified day of the current week
        let date = dayjs(weekstart.add(day, 'day')).format('YYYY-MM-DD');
        // If no log entry for that day, add it
        if (!$workspace.habitlogs[date]) $workspace.habitlogs[date] = {};
        // Set the log entry value as specified, by habit id
        $workspace.habitlogs[date][habit.id] = value;
        // Update statistics
        if (value == 1) $workspace.statistics.habits.completed++;
    }
</script>

<!-- Binding to the DOM, used to close context menu when clicking out of it -->
<svelte:window
    on:mousedown={(e) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore next-line
        if (element && menu && !element.contains(e.target) && !menu.contains(e.target))
            (showMenu = false), ($poppedup = false);
    }}
/>

<div
    class="group flex w-full items-center justify-start lg:h-[3.25rem] {single
        ? 'flex-row-reverse'
        : 'flex-col lg:flex-row'}"
    id="habititem-{habit.id}"
    bind:this={element}
    on:contextmenu|preventDefault={() => {
        if (!$poppedup) (showMenu = true), ($poppedup = true);
    }}
>
    <!-- Habit name and frequency -->
    <button
        class="flex cursor-pointer flex-row flex-wrap items-center justify-between py-3 text-left lg:flex-col lg:flex-nowrap lg:items-start lg:justify-center lg:py-2 lg:pt-3 lg:pb-1 {single
            ? 'flex-1'
            : 'w-full lg:w-1/2'}"
        on:click={() => {
            dispatch('edit', { habit: habit });
        }}
    >
        <h4 class="text-base text-black lg:h-7 lg:text-xl lg:group-hover:text-lg">
            {habit.name}
        </h4>
        <!-- Shows on parent hover, or permanently on mobile -->
        <p
            class="overflow-hidden text-sm italic text-black lg:h-0 lg:w-full lg:group-hover:mt-1 lg:group-hover:h-5 {single
                ? 'hidden lg:block'
                : ''}"
        >
            {habit.frequency.string}
        </p>
    </button>

    <!-- Row of progress circles -->
    <div
        class="flex h-[2.25rem] flex-row items-center justify-between lg:h-[3.25rem] lg:justify-start lg:gap-5 {single
            ? 'mr-3 ml-2'
            : 'w-full lg:ml-5 lg:w-fit lg:flex-1'}"
    >
        <!-- If regular variant, else if single -->
        {#if !single}
            <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
            {#each Array(7) as _i, i}
                <!-- If day of the current week applies to this habit, checks by start date and frequency -->
                {#if habit.frequency.days.includes(i) && dayjs(weekstart.add(i, 'day')).isAfter(dayjs(habit.frequency.start).subtract(1, 'day'), 'day')}
                    <!-- Add lines either side, to complete the border column for current day of the week -->
                    <div
                        class="flex h-full flex-col items-center justify-center px-2 py-1 {dayjs().day() == i
                            ? 'border-x-2 border-zinc-500'
                            : ''}"
                        title={dayjs(weekstart.add(i, 'day')).format('dddd, DD MMMM')}
                    >
                        <!-- Sets progress on click/right-click -->
                        <ProgressCircle
                            value={$workspace.habitlogs?.[dayjs(weekstart.add(i, 'day')).format('YYYY-MM-DD')]?.[
                                habit.id
                            ]}
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
                    <!-- Spacer to stop clumping when infrequent -->
                    <div class="h-full px-2 py-1 {dayjs().day() == i ? 'border-x-2 border-zinc-500' : ''}">
                        <span class="block h-0 w-7" />
                    </div>
                {/if}
            {/each}
        {:else}
            <ProgressCircle
                value={$workspace.habitlogs?.[dayjs(weekstart.add(dayofweek, 'day')).format('YYYY-MM-DD')]?.[habit.id]}
                inactive={dayjs().day() > dayofweek}
                on:click={() => {
                    if (dayjs().day() == dayofweek) setProgress(1, dayofweek);
                }}
                on:contextmenu={() => {
                    if (dayjs().day() == dayofweek) setProgress(0, dayofweek);
                }}
            />
        {/if}
    </div>
</div>

{#if showMenu}
    <!-- Context menu, used to mark progress, edit, and delete the habit -->
    <ContextMenu
        bind:element={menu}
        on:close={() => ((showMenu = false), ($poppedup = false))}
        anchor={{ x: element?.offsetLeft || 0, y: (element?.offsetTop || 0) + (element?.scrollHeight || 0) }}
    >
        {#if $workspace.habitlogs[dayjs().format('YYYY-MM-DD')][habit.id] != 0}
            <!-- Mark as not started button -->
            <ContextMenuButton on:click={() => setProgress(0, dayjs().day())}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as Not Started</span>
            </ContextMenuButton>
        {/if}

        {#if $workspace.habitlogs[dayjs().format('YYYY-MM-DD')][habit.id] != 1}
            <!-- Mark as completed button -->
            <ContextMenuButton on:click={() => setProgress(1, dayjs().day())}>
                <img src="/assets/icons/checkbox.svg" alt="Checkbox Icon" class="h-6 w-6" />
                <span>Mark as Complete</span>
            </ContextMenuButton>
        {/if}

        <!-- Separator line -->
        <div class="w-full border-b-2 border-gray-300" />

        <!-- Edit button -->
        <ContextMenuButton on:click={() => dispatch('edit', { habit: habit })}>
            <img src="/assets/icons/edit.svg" alt="Edit Icon" class="h-6 w-6" />
            <span>Edit Habit</span>
        </ContextMenuButton>

        <!-- Delete button -->
        <ContextMenuButton
            on:click={() => {
                if (!confirm('Are you sure you want to delete this habit?')) return;
                // Find index of habit
                let ref = $workspace.habits.findIndex((a) => a.id == habit.id);
                // If found...
                if (ref > -1) {
                    // remove from list
                    $workspace.habits.splice(ref, 1);
                    // Trigger Svelte's reactivity
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
    /* Add transition to all elements */
    * {
        @apply transition-all duration-300 ease-in-out;
    }
</style>
