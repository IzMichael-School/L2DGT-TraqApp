<script lang="ts">
    export let habit: Habit | undefined;
    import { workspace, newHabit, type Habit } from '$lib/pocketbase';
    import dayjs from 'dayjs';
    import SidebarModal from '$lib/SidebarModal.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import Button from '$lib/Button.svelte';
    import Toggle from '$lib/Toggle.svelte';
    import DatePicker from '$lib/DatePicker.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let showDatePicker = false;
</script>

<div class="flex-1" />
<SidebarModal on:close={() => (habit = undefined)}>
    {#if habit != undefined}
        <h1 class="mb-3 text-xl font-bold">Editing Habit</h1>

        <TextInput variant="ghost" bind:value={habit.name} class="w-full rounded-none border-b-2 border-black" />
        <p class="mb-3 w-full text-left text-sm">Habit Name</p>

        <div
            class="mb-1 grid w-full grid-flow-col grid-rows-4 gap-2 border-b-2 border-black p-2"
            style="direction: ltr;"
        >
            {#each days as day, i (day)}
                <div class="flex w-full flex-row items-center justify-start gap-2">
                    <Toggle
                        value={habit.frequency.days.includes(i)}
                        on:change={(e) => {
                            if (!habit?.frequency) return;
                            e.detail.value == true
                                ? (habit.frequency.days = [...new Set([...habit.frequency.days, i])])
                                : (habit.frequency.days = [
                                      ...new Set([...habit.frequency.days.filter((a) => a != i)]),
                                  ]);
                            habit.frequency.string = `${habit.frequency.days.length} Days a Week`;
                        }}
                    />
                    <p>{day}</p>
                </div>
            {/each}
        </div>
        <p class="mb-3 w-full text-left text-sm">Frequency by Day</p>

        <button
            class="my-1 flex w-full min-w-[12rem] flex-row items-center justify-start rounded-none border-b-2 border-black bg-transparent p-2 text-left font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-100"
            on:click={() => (showDatePicker = true)}
        >
            <p
                class="{habit?.frequency.start
                    ? 'flex-1'
                    : ''} max-h-6 overflow-hidden overflow-ellipsis transition-all duration-300 ease-in-out"
            >
                {dayjs(habit.frequency.start).format('dddd, DD MMMM YYYY') || 'Open Date Picker'}
            </p>
            <img src="/assets/icons/arrow-up.svg" alt="Arrow Pointing Right" class="ml-1 h-6 w-6 rotate-90" />
        </button>
        {#if showDatePicker}
            <ModalDimmer on:close={() => (showDatePicker = false)}>
                <div class="overflow-hidden rounded-lg border-x-2 border-t-2 border-zinc-200">
                    <DatePicker
                        bind:value={habit.frequency.start}
                        time={false}
                        on:change={() => (showDatePicker = false)}
                    />
                </div>
            </ModalDimmer>
        {/if}
        <p class="mb-3 w-full text-left text-sm">Start Date</p>

        <textarea
            bind:value={habit.notes}
            class="my-1 min-h-[4rem] w-full min-w-[12rem] flex-1 resize-none rounded-none border-b-2 border-black bg-transparent p-2 font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-100"
        />
        <p class="mb-3 w-full text-left text-sm">Notes</p>

        <Button
            variant="unstyled"
            class="mb-3 w-full bg-red-700 text-white hover:brightness-90"
            on:click={() => {
                if (!confirm('Are you sure you want to delete this habit?')) return;
                let ref = $workspace.habits.findIndex((a) => a.id == habit?.id);
                if (ref > -1) {
                    $workspace.habits.splice(ref, 1);
                    // eslint-disable-next-line no-self-assign
                    $workspace.habits = $workspace.habits;
                }
                habit = undefined;
            }}
        >
            Delete Habit
        </Button>
        <div class="flex w-full flex-row items-center justify-end gap-3">
            <Button
                variant="unstyled"
                class="flex-1 bg-red-700 text-white hover:brightness-90"
                on:click={() => {
                    habit = undefined;
                }}
            >
                Discard Changes
            </Button>
            <Button
                variant="unstyled"
                class="h-full flex-1 bg-green-600 text-white hover:brightness-90"
                on:click={async () => {
                    let ref = $workspace.habits.findIndex((a) => a.id == habit?.id);
                    if (ref > -1) {
                        $workspace.habits[ref] = habit ?? newHabit();
                    } else {
                        $workspace.habits = [...$workspace.habits, habit ?? newHabit()];
                    }
                    habit = undefined;
                }}
            >
                Save Changes
            </Button>
        </div>
    {/if}
</SidebarModal>

<style>
    button,
    p {
        flex-shrink: 0;
    }
</style>
