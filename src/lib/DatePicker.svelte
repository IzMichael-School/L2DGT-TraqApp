<script lang="ts">
    import dayjs from 'dayjs';
    import objectSupport from 'dayjs/plugin/objectSupport';
    dayjs.extend(objectSupport);

    import { createEventDispatcher } from 'svelte';
    const dispatch = createEventDispatcher();

    export let value: string,
        time = true;

    let input = dayjs(value),
        startOffset = dayjs().startOf('month').day(),
        selected: DateObj = {
            year: input.year(),
            month: input.month(),
            day: input.date(),
            hours: time ? input.hour() : 0,
            minutes: time ? Math.ceil(input.minute() / 5) * 5 : 0,
            seconds: 0,
        },
        viewer = {
            year: input.year(),
            month: input.month(),
        },
        timeEls: TimeEls = {
            hours: {},
            minutes: {},
        },
        scrollOpts: ScrollIntoViewOptions = { behavior: 'smooth', block: 'center', inline: 'center' };

    $: startOffset = dayjs(viewer).startOf('month').day();
    $: timeEls.hours[selected.hours]?.scrollIntoView(scrollOpts);
    $: timeEls.minutes[selected.minutes]?.scrollIntoView(scrollOpts);

    function leftPad(number: number): string {
        if (number < 10) return '0' + number;
        if (number >= 10) return number.toString();
        return number.toString();
    }

    type DateObj = {
        year: number;
        month: number;
        day: number;
        hours: number;
        minutes: number;
        seconds: number;
    };

    type TimeEls = {
        hours: {
            [key: string]: HTMLButtonElement;
        };
        minutes: {
            [key: string]: HTMLButtonElement;
        };
    };
</script>

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

<div class="wrapper flex h-[20rem] w-fit shrink-0 flex-col items-center justify-center overflow-hidden bg-white">
    <div class="flex max-h-full w-full flex-row items-center justify-center overflow-hidden">
        <!-- Date Picker -->
        <div class="dateWrapper flex h-full flex-col items-center justify-start">
            <div class="flex h-8 w-full flex-row items-center justify-between bg-zinc-200">
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
                <p class="text-center text-lg font-semibold">{dayjs(viewer).format('MMMM')} {viewer.year}</p>
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
                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each Array(startOffset) as _offset}
                    <p />
                {/each}

                <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                {#each Array(dayjs(viewer).daysInMonth()) as _day, i}
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
            <span class="min-h-0 flex-1" />
        </div>

        <!-- Time Picker -->
        {#if time}
            <div
                class="timeWrapper flex h-full max-h-full w-48 flex-1 flex-row items-center justify-center border-l-2 border-zinc-200"
            >
                <div class="flex max-h-full flex-1 flex-col items-center justify-start overflow-y-scroll">
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(4) as _offset}
                        <span class="block h-8 shrink-0 p-1" />
                    {/each}

                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(24) as _hour, i}
                        <button
                            class="w-full p-1 hover:bg-gray-200"
                            class:selected={selected.hours == i}
                            on:click={() => (selected.hours = i)}
                            bind:this={timeEls.hours[i.toString()]}
                        >
                            {leftPad(i)}
                        </button>
                    {/each}

                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(4) as _offset}
                        <span class="block h-8 shrink-0 p-1" />
                    {/each}
                </div>
                <div class="flex max-h-full flex-1 flex-col items-center justify-start overflow-y-scroll">
                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(4) as _offset}
                        <span class="block h-8 shrink-0 p-1" />
                    {/each}

                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(12) as _minute, i}
                        <button
                            class="w-full p-1 hover:bg-gray-200"
                            class:selected={selected.minutes == i * 5}
                            on:click={() => (selected.minutes = i * 5)}
                            bind:this={timeEls.minutes[(i * 5).toString()]}
                        >
                            {leftPad(i * 5)}
                        </button>
                    {/each}

                    <!-- eslint-disable-next-line @typescript-eslint/no-unused-vars -->
                    {#each Array(4) as _offset}
                        <span class="block h-8 shrink-0 p-1" />
                    {/each}
                </div>
            </div>
        {/if}
    </div>
    <div
        class="flex w-full items-center justify-between bg-zinc-200 {time
            ? 'h-16 flex-row py-1 pl-3 pr-1'
            : 'h-[4.9rem] flex-col gap-2 px-1 pb-1 pt-2'}"
    >
        <p class="font-bold">{dayjs(selected).format(time ? 'dddd, DD MMMM YYYY - HH:mm' : 'dddd, DD MMMM YYYY')}</p>
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
    .dateWrapper * {
        @apply shrink-0;
    }

    .daysOfTheWeek {
        @apply w-full text-center font-semibold;
    }

    .selected {
        @apply bg-slate-200 font-bold;
    }

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
