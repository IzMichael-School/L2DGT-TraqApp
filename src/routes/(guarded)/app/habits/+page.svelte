<script lang="ts">
    import { workspace, newHabit, type Habit } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    import dayjs, { type Dayjs } from 'dayjs';

    import HabitItem from '$lib/HabitItem.svelte';
    import HabitEditor from '$lib/HabitEditor.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';

    import { color, multiSorter } from '$lib/lib';
    $color = 'red';

    let editingHabit: Habit | undefined, weekstart: Dayjs;

    onMount(async () => {
        $workspace.habits.sort((a, b) => (a.name > b.name ? 1 : -1));
        weekstart = getWeek(new Date().toISOString());
    });

    function getWeek(date: string) {
        let ts = dayjs(date);
        let day = ts.day();
        return dayjs().subtract(day, 'day');
    }
</script>

<svelte:head>
    <title>Habits | Traq</title>
</svelte:head>

{#if weekstart}
    <div class="flex w-full flex-row items-end justify-start gap-5">
        <h2 class="mb-3 w-1/2 text-2xl font-bold lg:mb-7 lg:text-4xl">My Habits</h2>

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
{/if}

{#if $workspace?.id && weekstart}
    {#each $workspace.habits.sort(multiSorter(['tags', 'name'])) as habit (habit.id)}
        <HabitItem {habit} {weekstart} on:edit={(e) => (editingHabit = structuredClone(e.detail.habit))} />
    {:else}
        <p class="mb-1">Looks like you're not tracking any habits...</p>
    {/each}

    <div class="flex w-full flex-row items-center justify-start gap-5">
        <span class="block h-0 w-1/2" />

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
        class="-mt-2 flex flex-row items-center justify-start rounded-lg p-2 text-gray-500 hover:bg-slate-200"
        on:click={() => {
            const newhabit = newHabit();
            editingHabit = newhabit;
        }}
    >
        <img src="/assets/icons/plus.svg" alt="Plus Icon" class="mr-2 aspect-square h-5 w-5 opacity-50 lg:h-7 lg:w-7" />
        <span class="mr-2 text-sm lg:text-base">Add a Habit</span>
    </button>
{/if}

{#if editingHabit?.id}
    <ModalDimmer on:close={() => (editingHabit = undefined)}>
        <HabitEditor bind:habit={editingHabit} />
    </ModalDimmer>
{/if}

<style>
</style>
