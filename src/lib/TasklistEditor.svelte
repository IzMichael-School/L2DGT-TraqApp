<script lang="ts">
    // Declare Props
    export let tasklist: Tasklist | undefined;

    // Import stores, types, templates
    import { workspace, newTasklist, type Tasklist } from '$lib/pocketbase';

    // Import Custom Components
    import SidebarModal from '$lib/SidebarModal.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import Button from '$lib/Button.svelte';
</script>

<!-- Aligns sidebar modal to righthand-side of viewport -->
<div class="flex-1" />

<!-- Sidebar wrapper, with bg, container, and interaction hooks -->
<SidebarModal on:close={() => (tasklist = undefined)}>
    {#if tasklist != undefined}
        <!-- Modal Title -->
        <h1 class="mb-3 text-xl font-bold">Editing Task List</h1>

        <!-- Task List Name Input -->
        <TextInput variant="ghost" bind:value={tasklist.name} class="w-full rounded-none border-b-2 border-black" />
        <p class="mb-3 w-full text-left text-sm">Task List Name</p>

        <!-- Spacer, pushes apart the buttons and name input -->
        <div class="flex-1 p-1" />

        <!-- Delete task list button -->
        <Button
            variant="unstyled"
            class="mb-3 w-full bg-red-700 text-white hover:brightness-90"
            on:click={() => {
                // Confirm the deletion
                if (!confirm('Are you sure you want to delete this task?')) return;
                // Find the index of the selected task list
                let ref = $workspace.tasklists.findIndex((a) => a.id == tasklist?.id);
                // If index found...
                if (ref > -1) {
                    // Remove task from list
                    $workspace.tasklists.splice(ref, 1);
                    // Needed for reactivity
                    // eslint-disable-next-line no-self-assign
                    $workspace.tasklists = $workspace.tasklists;
                }
                // Clear editing selection
                tasklist = undefined;
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
                    if (!confirm('Are you sure you want to delete this task list?')) return;
                    // Clear editing selection and changes
                    tasklist = undefined;
                }}
            >
                Discard Changes
            </Button>
            <!-- Save task list button -->
            <Button
                variant="unstyled"
                class="h-full flex-1 bg-green-600 text-white hover:brightness-90"
                on:click={async () => {
                    // Find the index of the selected task list
                    let ref = $workspace.tasklists.findIndex((a) => a.id == tasklist?.id);
                    // If index found, or else...
                    if (ref > -1) {
                        // Assign new value to the ref, or template if not defined
                        $workspace.tasklists[ref] = tasklist ?? newTasklist();
                    } else {
                        // Add new value to list, or template if not defined
                        $workspace.tasklists = [...$workspace.tasklists, tasklist ?? newTasklist()];
                    }
                    // Clear editing selection
                    tasklist = undefined;
                }}
            >
                Save Changes
            </Button>
        </div>
    {/if}
</SidebarModal>

<style>
    /* Fix weird bug with flexbox shrinking */
    p {
        flex-shrink: 0;
    }
</style>
