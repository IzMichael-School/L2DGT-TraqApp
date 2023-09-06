<script lang="ts">
    // Import custom button component
    import Button from '$lib/Button.svelte';

    // Import JS navigation function
    import { goto } from '$app/navigation';

    // Height of 100vh, in pixels
    let vh: number;
</script>

<!-- Window title -->
<svelte:head>
    <title>Traq</title>
</svelte:head>

<!-- Hero section -->
<section class="flex h-screen w-full flex-col items-center justify-center" bind:clientHeight={vh}>
    <!-- Headings -->
    <h1 class="w-full text-center text-4xl font-semibold lg:text-7xl">Take control of your life,</h1>
    <h1 class="w-full text-center text-4xl font-semibold text-brand-blue lg:text-7xl">with Traq.</h1>
    <h3 class="mt-7 w-2/3 text-center text-lg lg:text-2xl">
        Turn your disorganised life into something perfectly planned, and track it all!
    </h3>

    <!-- CTA buttons -->
    <div class="mt-7 flex w-full flex-row flex-wrap items-center justify-start gap-3 px-5 lg:w-1/3 lg:px-0">
        <Button variant="default" class="flex-1" on:click={() => goto('/login')}>Login</Button>
        <Button variant="secondary" class="flex-1" on:click={() => goto('/register')}>Register</Button>
        <button
            class="min-w-[10rem] flex-1 font-bold"
            on:click={() => document.querySelector('#page')?.scrollTo({ top: vh, behavior: 'smooth' })}
        >
            or, Learn More ↓
        </button>
    </div>

    <!-- App example images -->
    <div
        class="mt-14 flex w-full flex-row items-start justify-center gap-7 overflow-hidden px-5 lg:h-1/2 lg:w-2/3 lg:px-0"
    >
        <!-- Mobile view of task list -->
        <img
            src="/assets/img/tasks-mobile.png"
            alt="The app's Tasks list view on mobile"
            class="hidden h-full rounded-2xl border-4 border-brand-blue bg-brand-blue object-cover object-top lg:block"
        />

        <!-- Desktop view of habit list -->
        <img
            src="/assets/img/habits.png"
            alt="The app's Habit list view"
            class="hidden h-full w-auto rounded-2xl border-4 border-brand-red bg-brand-red lg:block"
        />

        <!-- Desktop view of task list -->
        <img
            src="/assets/img/tasks.png"
            alt="The app's Task list view"
            class="h-full w-auto rounded-2xl border-4 border-brand-blue bg-brand-blue lg:hidden"
        />
    </div>
</section>

<!-- Tasks section -->
<section class="flex h-screen w-full flex-col items-center justify-center lg:flex-row">
    <div class="flex w-full flex-col items-start justify-center p-8 text-left lg:h-full lg:w-1/2 lg:p-16">
        <!-- Content -->
        <h1 class="text-3xl font-semibold lg:text-7xl">Track all of your tasks and to-dos.</h1>
        <h3 class="mt-7 text-lg lg:text-2xl">
            Need to buy a new table? Add a task.
            <br />
            Got a new assignment? Add a task.
            <br />
            Need to remember to do anything? Add a task.
        </h3>
        <!-- Continue scrolling button -->
        <button
            class="mt-7 flex w-full flex-row items-center justify-start font-bold"
            on:click={() => document.querySelector('#page')?.scrollTo({ top: vh * 2, behavior: 'smooth' })}
        >
            Keep Going ↓
        </button>
    </div>
    <!-- Image of the desktop view of the tasks list -->
    <div
        class="flex h-full w-full flex-row items-start justify-center overflow-hidden rounded-t-3xl bg-brand-paleblue p-5 lg:w-1/2 lg:rounded-l-3xl lg:p-10 lg:shadow-elevate"
    >
        <img
            src="/assets/img/tasks.png"
            alt="The app's Tasks list view"
            class="h-full w-full border-r-4 border-brand-blue object-cover object-left"
        />
    </div>
</section>

<!-- Habits section -->
<section class="flex h-screen w-full flex-col items-center justify-center lg:flex-row-reverse">
    <div class="flex w-full flex-col items-end justify-center p-8 text-left lg:h-full lg:w-1/2 lg:p-16 lg:text-right">
        <!-- Content -->
        <h1 class="text-3xl font-semibold lg:text-7xl">Make sure you're sticking to your routines.</h1>
        <h3 class="mt-7 text-lg lg:text-2xl">
            Starting a new exercise regiment? Track the habit.
            <br />
            Fixing your sleep schedule? Track the habit.
            <br />
            Forgetting to brush your teeth? Track the habit.
        </h3>
        <!-- Continue scrolling button -->
        <button
            class="mt-7 flex w-full flex-row items-center justify-start font-bold lg:justify-end"
            on:click={() => document.querySelector('#page')?.scrollTo({ top: vh * 2.6, behavior: 'smooth' })}
        >
            Keep Going ↓
        </button>
    </div>
    <!-- Two images of the weekly and then yearly view of the habits list, on mobile -->
    <div
        class="flex h-full w-full flex-row items-start justify-center gap-10 overflow-hidden rounded-t-3xl bg-brand-paleblue p-5 lg:w-1/2 lg:rounded-r-3xl lg:p-10 lg:shadow-elevate"
    >
        <img
            src="/assets/img/habits-mobile-one.png"
            alt="The app's Habits weekly list view"
            class="h-full w-full object-cover"
        />
        <img
            src="/assets/img/habits-mobile-two.png"
            alt="The app's Habits yearly list view"
            class="h-full w-full object-cover"
        />
    </div>
</section>

<!-- CTA Section -->
<section class="flex h-[25vh] w-full flex-col items-center justify-center bg-zinc-100 lg:mt-[5vh] lg:h-[50vh]">
    <h1 class="text-3xl font-semibold lg:text-7xl">Interested?</h1>
    <h1 class="mt-2 mb-4 text-3xl font-semibold text-brand-blue lg:text-7xl">Get Tracking!</h1>

    <!-- CTA buttons -->
    <div class="mt-3 flex w-full flex-row items-center justify-start gap-3 px-5 lg:mt-7 lg:w-1/3 lg:px-0">
        <Button variant="default" class="flex-1" on:click={() => goto('/login')}>Login</Button>
        <Button variant="secondary" class="flex-1" on:click={() => goto('/register')}>Register</Button>
    </div>
</section>

<!-- Copyright footer -->
<section class="flex h-[5vh] w-full flex-row items-center justify-between px-4">
    <a class="cursor-pointer text-lg font-bold hover:underline" href="https://izmichael.com">
        &copy; IzMichael 2023 - izmichael.com
    </a>
</section>

<style>
</style>
