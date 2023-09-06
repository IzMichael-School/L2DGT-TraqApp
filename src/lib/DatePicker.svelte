<script lang="ts">
    // Import DayJS and plugins
    import dayjs from 'dayjs';
    import objectSupport from 'dayjs/plugin/objectSupport';
    dayjs.extend(objectSupport);

    // Create dispatcher for click events
    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    // Declare Props
    export let value: string = dayjs().toISOString(),
        time = true;

    // Declare variables
    // Parse preset value into dayJS object
    let input = dayjs(value),
        // Find what day of the week the month starts
        startOffset = dayjs().startOf('month').day(),
        // Object controlling the selected value, prefilled with preset props
        selected: DateObj = {
            year: input.year(),
            month: input.month(),
            day: input.date(),
            hours: time ? input.hour() : 0,
            minutes: time ? Math.ceil(input.minute() / 5) * 5 : 0,
            seconds: 0,
        },
        // Object controlling the calendar viewer
        viewer = {
            year: input.year(),
            month: input.month(),
        },
        // List of buttons for time selection, used for scroll jumping
        timeEls: TimeEls = {
            hours: {},
            minutes: {},
        },
        // Scroll jumping configuration
        scrollOpts: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center', inline: 'center' };

    // Reactive statements
    // Updates the day of week the month starts on when the month is changed
    $: startOffset = dayjs(viewer).startOf('month').day();
    // Auto-scrolls to the selected hours and minutes in the time picker, when changed
    $: timeEls.hours[selected.hours]?.scrollIntoView(scrollOpts);
    $: timeEls.minutes[selected.minutes]?.scrollIntoView(scrollOpts);

    // Add a 0 to the start of a string if the number prop is lower than 10
    function leftPad(number: number): string {
        if (number < 10) return '0' + number;
        if (number >= 10) return number.toString();
        return number.toString();
    }

    // Typescript declaration for the 'selected' variable
    type DateObj = {
        year: number;
        month: number;
        day: number;
        hours: number;
        minutes: number;
        seconds: number;
    };

    // Typescript declaration for the time selection button list
    type TimeEls = {
        hours: {
            [key: string]: HTMLButtonElement;
        };
        minutes: {
            [key: string]: HTMLButtonElement;
        };
    };
</script>

<!-- Binding to the DOM, used for detecting keystrokes and moving the calendar accordingly -->
<svelte:window
    on:keydown={(e) => {
        if (e.key == 'ArrowRight') selected.day++;
        if (e.key == 'ArrowLeft') selected.day--;
        if (e.key == 'ArrowUp') selected.day -= 7;
        if (e.key == 'ArrowDown') selected.day += 7;

        if (selected.day > dayjs(viewer).daysInMonth()) {
            selected.day -= dayjs(viewer).daysInMonth();
            selected.month++;
            viewer.month++;
            if (viewer.month > 11) {
                viewer.month = 0;
                viewer.year++;
            }
            if (selected.month > 11) {
                selected.month = 0;
                selected.year++;
            }
        } else if (selected.day < 1) {
            selected.month--;
            viewer.month--;
            if (viewer.month < 0) {
                viewer.month = 11;
                viewer.year--;
            }
            if (selected.month < 0) {
                selected.month = 11;
                selected.year--;
            }
            selected.day += dayjs(viewer).daysInMonth();
        }
    }}
/>

<!-- Wrapper for the picker -->
<div class="wrapper flex h-[20rem] w-fit shrink-0 flex-col items-center justify-center overflow-hidden bg-white">
    <div class="flex max-h-full w-full flex-row items-center justify-center overflow-hidden">
        <!-- Date Picker -->
        <div class="dateWrapper flex h-full flex-col items-center justify-start">
            <div class="flex h-8 w-full flex-row items-center justify-between bg-zinc-200">
                <!-- Previous Month Button -->
                <button
                    on:click={() => {
                        viewer.month--;
                        if (viewer.month < 0) {
                            viewer.month = 11;
                            viewer.year--;
                        }
                    }}
                    class="p-1 hover:bg-gray-100"
                >
                    <img src="/assets/icons/chevron-up.svg" alt="Arrow Pointing Left" class="-rotate-90" />
                </button>
                <!-- Current Month & Year Display -->
                <p class="text-center text-lg font-semibold">{dayjs(viewer).format('MMMM')} {viewer.year}</p>
                <!-- Next Month Button -->
                <button
                    on:click={() => {
                        viewer.month++;
                        if (viewer.month > 11) {
                            viewer.month = 0;
                            viewer.year++;
                        }
                    }}
                    class="p-1 hover:bg-gray-100"
                >
                    <img src="/assets/icons/chevron-up.svg" alt="Arrow Pointing Right" class="rotate-90" />
                </button>
            </div>

            <!-- List of the days of the week, heading the columns of the calendar -->
            <div class="daysOfTheWeek grid h-8 w-full select-none grid-cols-7 bg-gray-100 py-1">
                <p>Su</p>
                <p>Mo</p>
                <p>Tu</p>
                <p>We</p>
                <p>Th</p>
                <p>Fr</p>
                <p>Sa</p>
            </div>
            <div class="grid w-full select-none grid-cols-7">
                <!-- Offset elements to align the start of the month to the right day of the week -->
                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each Array(startOffset) as _offset}
                    <span />
                {/each}

                <!-- Loop to render each day of the month -->
                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each Array(dayjs(viewer).daysInMonth()) as _day, i}
                    <!-- Button representing a day of the month, click to select that day, includes conditional class of 'selected' -->
                    <button
                        on:click={() => (
                            (selected.year = viewer.year), (selected.month = viewer.month), (selected.day = i + 1)
                        )}
                        class:selected={selected.year == viewer.year &&
                            selected.month == viewer.month &&
                            selected.day == i + 1}
                        class="aspect-square h-9 w-9 rounded-md text-center hover:bg-gray-200"
                    >
                        {i + 1}
                    </button>
                {/each}
            </div>
            <!-- Span to push the calendar to the top of the parent container -->
            <span class="min-h-0 flex-1" />
        </div>

        <!-- Time Picker -->
        {#if time}
            <div
                class="timeWrapper flex h-full max-h-full w-48 flex-1 flex-row items-center justify-center border-l-2 border-zinc-200"
            >
                <div class="flex max-h-full flex-1 flex-col items-center justify-start overflow-y-scroll">
                    <!-- Add padding to the top of the list, to allow centering the current time in the viewport -->
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(4) as _offset}
                        <span class="block h-8 shrink-0 p-1" />
                    {/each}

                    <!-- Loop to render each hour of the day -->
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(24) as _hour, i}
                        <!-- Button representing the hour of the day, selects on click, includes conditional class of 'selected' -->
                        <button
                            class="w-full p-1 hover:bg-gray-200"
                            class:selected={selected.hours == i}
                            on:click={() => (selected.hours = i)}
                            bind:this={timeEls.hours[i.toString()]}
                        >
                            {leftPad(i)}
                        </button>
                    {/each}

                    <!-- Add padding to the bottom of the list, to allow centering the current time in the viewport -->
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(4) as _offset}
                        <span class="block h-8 shrink-0 p-1" />
                    {/each}
                </div>
                <div class="flex max-h-full flex-1 flex-col items-center justify-start overflow-y-scroll">
                    <!-- Add padding to the top of the list, to allow centering the current time in the viewport -->
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(4) as _offset}
                        <span class="block h-8 shrink-0 p-1" />
                    {/each}

                    <!-- Loop to render every 5 minutes in an hour -->
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(12) as _minute, i}
                        <!-- Button representing the 5 minute interval, selects on click, includes conditional class of 'selected' -->
                        <button
                            class="w-full p-1 hover:bg-gray-200"
                            class:selected={selected.minutes == i * 5}
                            on:click={() => (selected.minutes = i * 5)}
                            bind:this={timeEls.minutes[(i * 5).toString()]}
                        >
                            {leftPad(i * 5)}
                        </button>
                    {/each}

                    <!-- Add padding to the bottom of the list, to allow centering the current time in the viewport -->
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(4) as _offset}
                        <span class="block h-8 shrink-0 p-1" />
                    {/each}
                </div>
            </div>
        {/if}
    </div>
    <!-- Bottom bar -->
    <div
        class="flex w-full items-center justify-between bg-zinc-200 {time
            ? 'h-16 flex-row py-1 pl-3 pr-1'
            : 'h-[4.9rem] flex-col gap-2 px-1 pb-1 pt-2'}"
    >
        <!-- Currently selected value of picker -->
        <p class="font-bold">{dayjs(selected).format(time ? 'dddd, DD MMMM YYYY - HH:mm' : 'dddd, DD MMMM YYYY')}</p>
        <!-- Submit button -->
        <button
            class="rounded-md bg-brand-blue px-4 py-1 text-white hover:brightness-90 {time ? '' : 'w-full'}"
            on:click={() => {
                value = dayjs(selected).toISOString();
                dispatch('change', {
                    value,
                });
            }}
        >
            Select
        </button>
    </div>
</div>

<style>
    /* Stops shrinkage from flexbox */
    .dateWrapper * {
        @apply shrink-0;
    }

    /* Apply to each day in the calendar headings */
    .daysOfTheWeek p {
        @apply w-full text-center font-semibold;
    }

    /* Applies to selected values in calendar and time picker */
    .selected {
        @apply bg-slate-200 font-bold;
    }

    /* Custom scrollbar */
    ::-webkit-scrollbar {
        width: 2px;
    }
    ::-webkit-scrollbar-track {
        background: #e4e4e7;
    }
    ::-webkit-scrollbar-thumb {
        background: #888;
    }
    ::-webkit-scrollbar-thumb:hover {
        background: #555;
    }
</style>
