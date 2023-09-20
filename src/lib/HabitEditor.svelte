<script lang="ts">
    // Declare Props
    export let habit: Habit | undefined;

    // Import libraries, functions, stores
    import { workspace, newHabit, type Habit } from '$lib/pocketbase';
    import dayjs from 'dayjs';

    // Import components used
    import SidebarModal from '$lib/SidebarModal.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import Button from '$lib/Button.svelte';
    import Toggle from '$lib/Toggle.svelte';
    import DatePicker from '$lib/DatePicker.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';

    // Declare list of days of the week
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    // Controls date picker visibility
    let showDatePicker = false;
</script>

<!-- Aligns sidebar modal to righthand-side of viewport -->
<div class="flex-1" />

<!-- Sidebar wrapper, with bg, container, and interaction hooks -->
<SidebarModal
    on:close={() => {
        if (confirm('Are you sure you want to discard your changes?')) habit = undefined;
    }}
>
    {#if habit != undefined}
        <!-- Modal Title -->
        <h1 class="mb-3 text-xl font-bold">Editing Habit</h1>

        <!-- Habit Name Input -->
        <TextInput variant="ghost" bind:value={habit.name} class="w-full rounded-none border-b-2 border-black" />
        <p class="mb-3 w-full text-left text-sm">Habit Name</p>

        <!-- Day of the week picker -->
        <div
            class="mb-1 grid w-full grid-flow-col grid-rows-4 gap-2 border-b-2 border-black p-2"
            style="direction: ltr;"
        >
            <!-- Iterate over each day of the week -->
            {#each days as day, i (day)}
                <div class="flex w-full flex-row items-center justify-start gap-2">
                    <Toggle
                        value={habit.frequency.days.includes(i)}
                        on:change={(e) => {
                            if (!habit?.frequency) return;
                            // Add/remove day from habit frequency object
                            e.detail.value == true
                                ? (habit.frequency.days = [...new Set([...habit.frequency.days, i])])
                                : (habit.frequency.days = [
                                      ...new Set([...habit.frequency.days.filter((a) => a != i)]),
                                  ]);
                            // Set DotW display string to represent selected value
                            habit.frequency.string = `${habit.frequency.days.length} Days a Week`;
                        }}
                    />
                    <p>{day}</p>
                </div>
            {/each}
        </div>
        <p class="mb-3 w-full text-left text-sm">Days of the Week</p>

        <!-- Date Picker Open/Close button -->
        <button
            class="my-1 flex w-full min-w-[12rem] flex-row items-center justify-start rounded-none border-b-2 border-black bg-transparent p-2 text-left font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-100"
            on:click={() => (showDatePicker = true)}
        >
            <!-- Show habit start date, or open hint if no start date specified -->
            <p
                class="{habit?.frequency.start
                    ? 'flex-1'
                    : ''} max-h-6 overflow-hidden overflow-ellipsis transition-all duration-300 ease-in-out"
            >
                {habit.frequency.start
                    ? dayjs(habit.frequency.start).format('dddd, DD MMMM YYYY')
                    : 'Open Calendar Picker'}
            </p>
            <img src="/assets/icons/arrow-up.svg" alt="Arrow Pointing Right" class="ml-1 h-6 w-6 rotate-90" />
        </button>
        <!-- Show Date Picker if requested, and dim rest of screen -->
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

        <!-- Generic notes textarea -->
        <textarea
            bind:value={habit.notes}
            class="my-1 min-h-[4rem] w-full min-w-[12rem] flex-1 resize-none rounded-none border-b-2 border-black bg-transparent p-2 font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-100"
        />
        <p class="mb-3 w-full text-left text-sm">Notes</p>

        <!-- Delete habit button -->
        <Button
            variant="unstyled"
            class="mb-3 w-full bg-red-700 text-white hover:brightness-90"
            on:click={() => {
                // Confirm the deletion
                if (!confirm('Are you sure you want to delete this habit?')) return;
                // Find the index of the selected habit
                let ref = $workspace.habits.findIndex((a) => a.id == habit?.id);
                // If index found...
                if (ref > -1) {
                    // Remove habit from list
                    $workspace.habits.splice(ref, 1);
                    // Needed for reactivity
                    // eslint-disable-next-line no-self-assign
                    $workspace.habits = $workspace.habits;
                }
                // Clear editing selection
                habit = undefined;
            }}
        >
            Delete Habit
        </Button>
        <!-- Place buttons side-by-side -->
        <div class="flex w-full flex-row items-center justify-end gap-3">
            <!-- Discard habit button -->
            <Button
                variant="unstyled"
                class="flex-1 bg-red-700 text-white hover:brightness-90"
                on:click={() => {
                    // Confirm the discarding
                    if (!confirm('Are you sure you want to discard your changes?')) return;
                    // Clear editing selection and changes
                    habit = undefined;
                }}
            >
                Discard Changes
            </Button>
            <!-- Save habit button -->
            <Button
                variant="unstyled"
                class="h-full flex-1 bg-green-600 text-white hover:brightness-90"
                on:click={async () => {
                    // Find the index of the selected habit
                    let ref = $workspace.habits.findIndex((a) => a.id == habit?.id);
                    // If index found, or else...
                    if (ref > -1) {
                        // Assign new value to the ref, or template if not defined
                        $workspace.habits[ref] = habit ?? newHabit();
                    } else {
                        // Add new value to list, or template if not defined
                        $workspace.habits = [...$workspace.habits, habit ?? newHabit()];
                    }
                    // Clear editing selection
                    habit = undefined;
                }}
            >
                Save Changes
            </Button>
        </div>
    {/if}
</SidebarModal>

<style>
    /* Fix weird bug with flexbox shrinking */
    button,
    p {
        flex-shrink: 0;
    }
</style>
