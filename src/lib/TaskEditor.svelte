<script lang="ts">
    // Declare Props
    export let task: Task | undefined;

    // Import Libraries
    import { workspace, newTask, type Task } from '$lib/pocketbase';
    import dayjs from 'dayjs';

    // Import Custom Components
    import SidebarModal from '$lib/SidebarModal.svelte';
    import ProgressCircle from '$lib/ProgressCircle.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import Button from '$lib/Button.svelte';
    import TaskPicker from '$lib/TaskPicker.svelte';
    import DatePicker from '$lib/DatePicker.svelte';
    import ModalDimmer from '$lib/ModalDimmer.svelte';

    // Declare Variables
    let parentObj: Task | undefined,
        showDatePicker = false;
</script>

<!-- Aligns sidebar modal to righthand-side of viewport -->
<div class="flex-1" />

<!-- Sidebar wrapper, with bg, container, and interaction hooks -->
<SidebarModal on:close={() => (task = undefined)}>
    {#if task != undefined}
        <!-- Modal Title -->
        <h1 class="mb-3 text-xl font-bold">Editing Task</h1>

        <!-- Task Name Input -->
        <TextInput variant="ghost" bind:value={task.name} class="w-full rounded-none border-b-2 border-black" />
        <p class="mb-3 w-full text-left text-sm">Task Name</p>

        <!-- Task Progress Input -->
        <div class="my-1 flex w-full flex-row items-center justify-end gap-2 border-b-2 border-black pl-2">
            <!-- Progress circle, interactive, represents progress value in increments of 50% -->
            <ProgressCircle
                bind:value={task.progress}
                on:click={() => {
                    if (task && task.progress < 1) task.progress += 0.5;
                }}
                on:contextmenu={() => {
                    if (task && task.progress > 0) task.progress -= 0.5;
                }}
            />

            <!-- Native dropdown for options -->
            <!-- Consider replacing with custom component? Accessibility is easier with native... -->
            <select
                class="w-full min-w-[12rem] rounded-none bg-transparent p-2 font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-100"
                bind:value={task.progress}
            >
                <option value={0}>Not Started</option>
                <option value={0.5}>In Progress</option>
                <option value={1}>Completed</option>
            </select>
        </div>
        <p class="mb-3 w-full text-left text-sm">Progress</p>

        <!-- Task List Selector, native dropdown, once again consider replacing -->
        <select
            class="my-1 w-full min-w-[12rem] rounded-none border-b-2 border-black bg-transparent p-2 font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-100"
            bind:value={task.list}
        >
            {#each $workspace.tasklists as list}
                <option value={list.id}>{list.name}</option>
            {/each}
        </select>
        <p class="mb-3 w-full text-left text-sm">List</p>

        <!-- Generic notes textarea -->
        <textarea
            bind:value={task.notes}
            class="my-1 min-h-[4rem] w-full min-w-[12rem] flex-1 resize-none rounded-none border-b-2 border-black bg-transparent p-2 font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-100"
        />
        <p class="mb-3 w-full text-left text-sm">Notes</p>

        <!-- Date Picker Open/Close button -->
        <button
            class="my-1 flex w-full min-w-[12rem] flex-row items-center justify-start rounded-none border-b-2 border-black bg-transparent p-2 text-left font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-100"
            on:click={() => (showDatePicker = true)}
        >
            <!-- Show task due date, or open hint if no due date specified -->
            <p
                class="{task?.duedate
                    ? 'flex-1'
                    : ''} max-h-6 overflow-hidden overflow-ellipsis transition-all duration-300 ease-in-out"
            >
                {task.duedate ? dayjs(task.duedate).format('dddd, DD MMMM YYYY - HH:mm') : 'Open Date Picker'}
            </p>
            <img src="/assets/icons/arrow-up.svg" alt="Arrow Pointing Right" class="ml-1 h-6 w-6 rotate-90" />
        </button>
        <!-- Show Date Picker if requested, and dim rest of screen -->
        {#if showDatePicker}
            <ModalDimmer on:close={() => (showDatePicker = false)}>
                <div class="overflow-hidden rounded-lg border-x-2 border-t-2 border-zinc-200">
                    <DatePicker bind:value={task.duedate} on:change={() => (showDatePicker = false)} />
                </div>
            </ModalDimmer>
        {/if}
        <p class="mb-3 w-full text-left text-sm">Due Date</p>

        <!-- Task Picker modal, button as slot in component -->
        <TaskPicker bind:value={task.parent} bind:valueFull={parentObj}>
            <!-- Task Picker Open/Close button -->
            <button
                class="my-1 flex w-full min-w-[12rem] flex-row items-center justify-start rounded-none border-b-2 border-black bg-transparent p-2 text-left font-normal outline-none transition-colors duration-200 ease-in-out hover:bg-gray-100"
            >
                <!-- Show task parent, or open hint if no parent specified -->
                <p
                    class="{task?.parent
                        ? 'flex-1'
                        : ''} max-h-6 overflow-hidden overflow-ellipsis transition-all duration-300 ease-in-out"
                >
                    {parentObj?.name || 'Open Task Picker'}
                </p>
                <img src="/assets/icons/arrow-up.svg" alt="Arrow Pointing Right" class="ml-1 h-6 w-6 rotate-90" />
            </button>
        </TaskPicker>
        <p class="mb-3 w-full text-left text-sm">Parent Task</p>

        <!-- Delete task button -->
        <Button
            variant="unstyled"
            class="mb-3 w-full bg-red-700 text-white hover:brightness-90"
            on:click={() => {
                // Confirm the deletion
                if (!confirm('Are you sure you want to delete this task?')) return;
                // Find the index of the selected task
                let ref = $workspace.tasks.findIndex((a) => a.id == task?.id);
                // If index found...
                if (ref > -1) {
                    // Remove task from list
                    $workspace.tasks.splice(ref, 1);
                    // Needed for reactivity
                    // eslint-disable-next-line no-self-assign
                    $workspace.tasks = $workspace.tasks;
                }
                // Clear editing selection
                task = undefined;
            }}
        >
            Delete Task
        </Button>
        <!-- Place buttons side-by-side -->
        <div class="flex w-full flex-row items-center justify-end gap-3">
            <!-- Discard changes button -->
            <Button
                variant="unstyled"
                class="flex-1 bg-red-700 text-white hover:brightness-90"
                on:click={() => {
                    // Confirm the discarding
                    if (!confirm('Are you sure you want to delete this task?')) return;
                    // Clear editing selection and changes
                    task = undefined;
                }}
            >
                Discard Changes
            </Button>
            <!-- Save task button -->
            <Button
                variant="unstyled"
                class="h-full flex-1 bg-green-600 text-white hover:brightness-90"
                on:click={async () => {
                    // Find the index of the selected task
                    let ref = $workspace.tasks.findIndex((a) => a.id == task?.id);
                    // If index found, or else...
                    if (ref > -1) {
                        // Assign new value to the ref, or template if not defined
                        $workspace.tasks[ref] = task ?? newTask();
                    } else {
                        // Add new value to list, or template if not defined
                        $workspace.tasks = [...$workspace.tasks, task ?? newTask()];
                    }
                    // Clear editing selection
                    task = undefined;
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
