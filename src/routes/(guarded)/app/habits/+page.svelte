<script lang="ts">
    // Import libraries, stores, types
    import { workspace, newHabit, type Habit } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    import dayjs, { type Dayjs } from 'dayjs';
    import isLeapYear from 'dayjs/plugin/isLeapYear';
    import dayOfYear from 'dayjs/plugin/dayOfYear';
    dayjs.extend(isLeapYear);
    dayjs.extend(dayOfYear);

    // Import custom components
    import HabitItem from '$lib/HabitItem.svelte';
    import HabitEditor from '$lib/HabitEditor.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';
    import ProgressCircle from '$lib/ProgressCircle.svelte';

    // Set page colour to red
    import { color } from '$lib/lib';
    $color = 'red';

    // Declare variables
    let editingHabit: Habit | undefined,
        weekstart: Dayjs,
        yearlyViewing = '',
        yearStart = dayjs().startOf('year').startOf('week');

    // Runs on component load
    onMount(async () => {
        // Sort the habit list
        $workspace.habits.sort((a, b) => (a.name > b.name ? 1 : -1));
        // Get the date for the start of the week
        weekstart = dayjs().startOf('week');
        // Set yearly viewer to view first habit, alphabetically
        yearlyViewing = $workspace.habits.sort((a, b) => (a.name > b.name ? 1 : -1))[0]?.id;
    });
</script>

<!-- Set Window Title -->
<svelte:head>
    <title>Habits | Traq</title>
</svelte:head>

<!-- Page title -->
<h2 class="mb-3 text-2xl font-bold lg:mb-7 lg:text-4xl">My Habits</h2>

{#if weekstart}
    <section class="contents">
        <h2 class="mb-1 text-lg font-bold lg:-mb-8 lg:text-2xl">
            This Week ({weekstart.format('D MMM')} - {weekstart.add(6, 'day').format('D MMM')})
        </h2>
        <div class="flex w-full flex-row items-end justify-between lg:justify-start lg:gap-5">
            <span class="hidden h-0 w-1/2 lg:block" />

            <!-- Iterate over 7 days of the week -->
            <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
            {#each Array(7) as _i, i}
                <!-- Show header with 3-letter name of day of week -->
                <div
                    class="h-full rounded-t-lg px-2 py-1 {dayjs().day() == i
                        ? 'border-x-2 border-t-2 border-zinc-500'
                        : ''}"
                >
                    <p
                        class="flex w-7 flex-row items-center justify-center text-center {dayjs().day() == i
                            ? 'font-bold'
                            : ''} {dayjs().day() > i ? 'text-brand-lightgrey line-through' : 'text-black'}"
                    >
                        {dayjs(weekstart.add(i, 'day')).format('ddd')}
                    </p>
                </div>
            {/each}
        </div>

        {#if $workspace?.id}
            <div id="habits" class="contents">
                <!-- List habits with HabitItem component -->
                {#each $workspace.habits.sort((a, b) => (a.name > b.name ? 1 : -1)) as habit (habit.id)}
                    <HabitItem {habit} {weekstart} on:edit={(e) => (editingHabit = structuredClone(e.detail.habit))} />
                {:else}
                    <p class="mb-1">Looks like you're not tracking any habits...</p>
                {/each}
            </div>

            <!-- Add ends of bordered columns -->
            <div class="flex w-full flex-row items-center justify-between lg:justify-start lg:gap-5">
                <span class="hidden h-0 w-1/2 lg:block" />

                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each Array(7) as _i, i}
                    <div
                        class="h-full rounded-b-lg px-2 py-1 {dayjs().day() == i
                            ? 'border-x-2 border-b-2 border-zinc-500'
                            : ''}"
                    >
                        <span class="block h-0 w-7" />
                    </div>
                {/each}
            </div>

            <!-- Button to add a new habit -->
            <button
                class="mt-2 flex flex-row items-center justify-start rounded-lg p-2 text-gray-500 hover:bg-slate-200 lg:-mt-2"
                on:click={() => {
                    const newhabit = newHabit();
                    editingHabit = { ...newhabit };
                }}
            >
                <img
                    src="/assets/icons/plus.svg"
                    alt="Plus Icon"
                    class="mr-2 aspect-square h-5 w-5 opacity-50 lg:h-7 lg:w-7"
                />
                <span class="mr-2 text-sm lg:text-base">Add a Habit</span>
            </button>
        {/if}
    </section>

    <section class="contents">
        <h2 class="mb-1 mt-8 text-lg font-bold lg:mb-4 lg:mt-16 lg:text-2xl">This Year ({dayjs().format('YYYY')})</h2>
        <div class="flex w-full flex-col items-start justify-start lg:flex-row">
            <!-- Only show on mobile -->
            <div class="mb-2 flex w-full flex-row items-center justify-center lg:hidden">
                <!-- Dropdown menu to select a habit to view -->
                <select
                    class="w-full rounded-lg bg-gray-200 p-2 font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-300"
                    bind:value={yearlyViewing}
                >
                    {#each $workspace.habits.sort((a, b) => (a.name > b.name ? 1 : -1)) as habit}
                        <option value={habit.id}>
                            {habit.name}
                        </option>
                    {/each}
                </select>
            </div>

            <!-- Only show on desktop -->
            <div class="mr-10 hidden h-full w-1/2 flex-col items-center justify-start lg:flex">
                <!-- Add a button for each habit to view -->
                {#each $workspace.habits.sort((a, b) => (a.name > b.name ? 1 : -1)) as habit}
                    <button
                        class="flex w-full flex-row items-center justify-start rounded-lg p-2 {yearlyViewing == habit.id
                            ? 'bg-brand-red font-semibold text-white'
                            : 'bg-transparent'}"
                        on:click={() => (yearlyViewing = habit.id)}
                    >
                        {habit.name}
                    </button>
                {/each}
            </div>

            <!-- Grid of every day of the year -->
            <div class="grid grid-cols-9 gap-x-2 gap-y-4 max-lg:w-full">
                <!-- Day of the week titles -->
                <span />
                <p class="w-full text-center text-sm lg:text-base">Sun</p>
                <p class="w-full text-center text-sm lg:text-base">Mon</p>
                <p class="w-full text-center text-sm lg:text-base">Tue</p>
                <p class="w-full text-center text-sm lg:text-base">Wed</p>
                <p class="w-full text-center text-sm lg:text-base">Thu</p>
                <p class="w-full text-center text-sm lg:text-base">Fri</p>
                <p class="w-full text-center text-sm lg:text-base">Sat</p>
                <span />

                <!-- Iterate over every week, 53 to account for not starting on a Sunday -->
                {#if yearlyViewing}
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(53) as _week, i}
                        <!-- Add the date for the Sunday of that week -->
                        <p class="w-full text-right text-sm lg:text-base">{yearStart.add(i, 'weeks').format('D/M')}</p>
                        <!-- Iterate over each day of that week -->
                        <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                        {#each Array(7) as _day, d}
                            {#if i + d + 6 * i < (dayjs().isLeapYear() ? 366 : 365)}
                                <!-- Define value const to be the currently specified value for that date -->
                                {@const value =
                                    $workspace.habitlogs?.[
                                        dayjs(yearStart.add(i, 'weeks').add(d, 'day')).format('YYYY-MM-DD')
                                    ]?.[yearlyViewing]}
                                <!-- If value specified or day applies to habit, show progress circle pre-filled and non-interactive -->
                                {#if value || $workspace.habits
                                        .find((a) => a.id == yearlyViewing)
                                        ?.frequency.days.includes(d)}
                                    <div class="flex w-full flex-row items-center justify-center">
                                        <ProgressCircle {value} inactive={dayjs().dayOfYear() > i + 1 + d + 6 * i} />
                                    </div>
                                {:else}
                                    <span />
                                {/if}
                            {/if}
                        {/each}
                        <!-- If week is a full 7 days, add date of that Saturday -->
                        {#if yearStart
                            .add(i, 'weeks')
                            .add(6, 'days')
                            .format('YYYY') == yearStart.format('YYYY') || yearStart.endOf('year').day() == 6}
                            <p class="w-full text-left text-sm lg:text-base">
                                {yearStart.add(i, 'weeks').add(6, 'days').format('D/M')}
                            </p>
                        {/if}
                    {/each}
                {/if}
            </div>
        </div>
    </section>
{/if}

<!-- Habit Editor modal -->
{#if editingHabit?.id}
    <!-- Dims the screen -->
    <ModalDimmer on:close={() => (editingHabit = undefined)}>
        <HabitEditor bind:habit={editingHabit} />
    </ModalDimmer>
{/if}

<style>
</style>
