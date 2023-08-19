<script lang="ts">
    // import { workspace, newHabit, type Habit } from '$lib/pocketbase';
    import { onMount } from 'svelte';
    // import HabitItem from '$lib/HabitItem.svelte';
    // import HabitEditor from '$lib/HabitEditor.svelte';
    // import Button from '$lib/Button.svelte';
    // import ModalDimmer from '$lib/ModalDimmer.svelte';

    import { color } from '$lib/lib';
    $color = 'red';

    // let editingHabit: Habit | undefined;

    onMount(async () => {
        // $workspace.habits.sort((a, b) => (a.name > b.name ? 1 : -1));
    });
</script>

<h2 class="mb-7 text-4xl font-bold">My Habits</h2>

<!-- {#if $workspace?.id}
    {#each $workspace.habits as habit (habit.id)}
        <p>{habit.name}</p>
    {:else}
        <h3>Looks like you don't have any habits...</h3>
    {/each}
    <button
        class="flex flex-row items-center justify-start rounded-lg p-2 text-gray-500 hover:bg-slate-200"
        on:click={() => {
            const newhabit = newHabit();
            editingHabit = newhabit;
        }}
    >
        <img src="/assets/icons/plus.svg" alt="Plus Icon" class="mr-2 h-7 w-7 opacity-50" />
        <span class="mr-2">Add a Habit</span>
    </button>
{/if}

{#if editingHabit?.id}
    <ModalDimmer on:close={() => (editingHabit = undefined)}>
        <HabitEditor bind:habit={editingHabit} />
    </ModalDimmer>
{/if} -->
<style>
</style>
