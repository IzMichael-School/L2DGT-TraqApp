<script lang="ts">
    // Import libraries, stores, types
    import { color, multiSorter } from '$lib/lib';
    import { currentUser, pb, workspace } from '$lib/pocketbase';
    import { flip } from 'svelte/animate';
    import { browser } from '$app/environment';
    import dayjs from 'dayjs';

    // Set colour of dashboard to lavender
    $color = 'lavender';

    // Import Components
    import TaskItem from '$lib/TaskItem.svelte';
    import HabitItem from '$lib/HabitItem.svelte';
    import Button from '$lib/Button.svelte';

    // Get day of week for habit dashboard
    let dayofweek = dayjs().day();
    let weekstart = dayjs().startOf('week');

    // Status of verification email sending
    let verificationSent = false;
</script>

<!-- Set page title to Home -->
<svelte:head>
    <title>Home | Traq</title>
</svelte:head>

<div class="flex h-full w-full flex-col items-center justify-start">
    <div class="mb-3 w-full rounded-xl bg-white p-2 shadow-lg lg:mb-7 lg:p-3">
        <h1 class="w-full text-center text-2xl font-bold lg:text-left lg:text-3xl">
            Welcome{browser && window.location?.search.includes('first=true') ? '' : ' Back'}{$currentUser?.username
                ? ', ' + $currentUser.username
                : '!'}
        </h1>
    </div>

    <div
        class="flex h-full w-full flex-col items-center justify-start gap-3 {$workspace
            ? 'lg:grid lg:grid-cols-3 lg:gap-7'
            : ''}"
    >
        {#if $workspace}
            <div class="flex h-full w-full flex-col items-center justify-start">
                {#if !$currentUser?.verified}
                    <div
                        class="mb-3 flex w-full flex-row items-center justify-start rounded-xl border-4 border-yellow-400 bg-white p-2 text-black shadow-md lg:mb-7 lg:px-5 lg:py-2"
                    >
                        <span class="mr-2 text-4xl font-bold lg:mr-5">!</span>
                        <div class="flex flex-1 flex-col items-start justify-center">
                            <h2 class="text-lg font-bold">Your email is not verified</h2>
                            <p class="text-sm">You will not be able to change your password until you verify.</p>
                            <Button
                                on:click={async () => {
                                    if (verificationSent) return;
                                    pb.collection('users').requestVerification($currentUser.email);
                                    verificationSent = true;
                                }}
                                class="mt-3 w-full bg-yellow-400 hover:bg-yellow-300"
                                variant="unstyled"
                            >
                                {verificationSent ? 'Done! Check your email inbox.' : 'Resend Verification Email'}
                            </Button>
                        </div>
                    </div>
                {/if}

                <div class="w-full rounded-xl bg-white p-2 pl-4 shadow-lg lg:flex-1 lg:px-5 lg:py-2">
                    <h2 class="mt-2 mb-4 text-xl font-bold">Workspace Statistics</h2>
                    <p class="mb-4 text-base lg:text-xl">
                        <b>Tasks Created:</b>
                        {$workspace.statistics.tasks.created}
                    </p>
                    <p class="mb-4 text-base lg:text-xl">
                        <b>Tasks Completed:</b>
                        {$workspace.statistics.tasks.completed}
                    </p>
                    <p class="mb-4 text-base lg:text-xl">
                        <b>Habits Completed:</b>
                        {$workspace.statistics.habits.completed}
                    </p>
                </div>
            </div>

            <div class="w-full rounded-xl bg-white p-2 shadow-lg lg:h-full lg:p-3">
                <h2 class="my-2 ml-2 text-xl font-bold">Upcoming Tasks</h2>
                {#each $workspace.tasks
                    .filter((task) => task.duedate && task.progress < 1)
                    .sort(multiSorter(['duedate', 'progress', 'name'])) as task (task.id)}
                    <div animate:flip={{ delay: 400 }}>
                        <TaskItem {task} />
                    </div>
                {:else}
                    <p class="mb-1 ml-2">Looks like you don't have any upcoming tasks...</p>
                {/each}
            </div>

            <div class="w-full rounded-xl bg-white p-2 shadow-lg lg:h-full lg:p-3">
                <h2 class="my-2 ml-2 text-xl font-bold">Today's Habits</h2>
                {#each $workspace.habits
                    .filter((habit) => habit.frequency.days.includes(dayofweek) && dayjs().isAfter(dayjs(habit.frequency.start).subtract(1, 'day'), 'day'))
                    .sort(multiSorter(['name'])) as habit (habit.id)}
                    <div animate:flip={{ delay: 400 }}>
                        <HabitItem {habit} {weekstart} single={true} {dayofweek} />
                    </div>
                {:else}
                    <p class="mb-1 ml-2">Looks like you don't have any upcoming tasks...</p>
                {/each}
            </div>
        {:else}
            <div class="mb-3 w-full rounded-xl bg-white p-2 shadow-lg lg:mb-7 lg:p-3">
                <p>Loading Workspace...</p>
                <br />
                <p>
                    Having trouble? <a href="/app" data-sveltekit-reload class="text-blue-500 hover:underline">
                        Click here to refresh.
                    </a>
                </p>
            </div>
        {/if}
    </div>
</div>

<style>
</style>
