<script lang="ts">
    import { workspace, newHabit, type Habit } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    import dayjs, { type Dayjs } from 'dayjs';
    import isLeapYear from 'dayjs/plugin/isLeapYear';
    import dayOfYear from 'dayjs/plugin/dayOfYear';
    dayjs.extend(isLeapYear);
    dayjs.extend(dayOfYear);

    import HabitItem from '$lib/HabitItem.svelte';
    import HabitEditor from '$lib/HabitEditor.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';
    import ProgressCircle from '$lib/ProgressCircle.svelte';

    import { color, multiSorter } from '$lib/lib';
    $color = 'red';

    let editingHabit: Habit | undefined,
        weekstart: Dayjs,
        yearlyViewing = '',
        yearStart = dayjs().startOf('year').startOf('week');

    onMount(async () => {
        $workspace.habits.sort((a, b) => (a.name > b.name ? 1 : -1));
        weekstart = dayjs().startOf('week');
        yearlyViewing = $workspace.habits.sort(multiSorter(['tags', 'name']))[0].id;
    });
</script>

<svelte:head>
    <title>Habits | Traq</title>
</svelte:head>

<!-- <h2 class="mb-3 text-2xl font-bold lg:-mb-5 lg:text-4xl">My Habits</h2> -->
<h2 class="mb-3 text-2xl font-bold lg:mb-7 lg:text-4xl">My Habits</h2>

{#if weekstart}
    <section class="contents">
        <h2 class="mb-1 text-lg font-bold lg:-mb-8 lg:text-2xl">
            This Week ({weekstart.format('D MMM')} - {weekstart.add(7, 'day').format('D MMM')})
        </h2>
        <div class="flex w-full flex-row items-end justify-between lg:justify-start lg:gap-5">
            <span class="hidden h-0 w-1/2 lg:block" />

            <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
            {#each Array(7) as _i, i}
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
            {#each $workspace.habits.sort(multiSorter(['tags', 'name'])) as habit (habit.id)}
                <HabitItem {habit} {weekstart} on:edit={(e) => (editingHabit = structuredClone(e.detail.habit))} />
            {:else}
                <p class="mb-1">Looks like you're not tracking any habits...</p>
            {/each}

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

            <button
                class="mt-2 flex flex-row items-center justify-start rounded-lg p-2 text-gray-500 hover:bg-slate-200 lg:-mt-2"
                on:click={() => {
                    const newhabit = newHabit();
                    editingHabit = newhabit;
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
            <div class="mb-2 flex w-full flex-row items-center justify-center lg:hidden">
                <select
                    class="w-full rounded-lg bg-gray-200 p-2 font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-300"
                    bind:value={yearlyViewing}
                >
                    {#each $workspace.habits.sort(multiSorter(['tags', 'name'])) as habit}
                        <option value={habit.id}>
                            {habit.name}
                        </option>
                    {/each}
                </select>
            </div>

            <div class="mr-10 hidden h-full w-1/2 flex-col items-center justify-start lg:flex">
                {#each $workspace.habits.sort(multiSorter(['tags', 'name'])) as habit}
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

            <div class="grid grid-cols-9 gap-x-2 gap-y-4 max-lg:w-full">
                <span />
                <p class="w-full text-center">Sun</p>
                <p class="w-full text-center">Mon</p>
                <p class="w-full text-center">Tue</p>
                <p class="w-full text-center">Wed</p>
                <p class="w-full text-center">Thu</p>
                <p class="w-full text-center">Fri</p>
                <p class="w-full text-center">Sat</p>
                <span />

                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each Array(53) as _week, i}
                    <p class="w-full text-right">{yearStart.add(i, 'weeks').format('D/M')}</p>
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(7) as _day, d}
                        {#if i + d + 6 * i < (dayjs().isLeapYear() ? 366 : 365)}
                            {@const value =
                                $workspace.habitlogs?.[
                                    dayjs(yearStart.add(i, 'weeks').add(d, 'day')).format('YYYY-MM-DD')
                                ]?.[yearlyViewing]}
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
                    {#if yearStart
                        .add(i, 'weeks')
                        .add(6, 'days')
                        .format('YYYY') == yearStart.format('YYYY') || yearStart.endOf('year').day() == 6}
                        <p class="w-full text-left">{yearStart.add(i, 'weeks').add(6, 'days').format('D/M')}</p>
                    {/if}
                {/each}
            </div>
        </div>
    </section>
{/if}

{#if editingHabit?.id}
    <ModalDimmer on:close={() => (editingHabit = undefined)}>
        <HabitEditor bind:habit={editingHabit} />
    </ModalDimmer>
{/if}

<style>
</style>
