<script lang="ts">
    export let tasklist: Tasklist | undefined;
    import { workspace, newTasklist, type Tasklist } from '$lib/pocketbase';
    import SidebarModal from '$lib/SidebarModal.svelte';
    import TextInput from '$lib/TextInput.svelte';
    import Button from '$lib/Button.svelte';
</script>

<div class="flex-1" />
<SidebarModal on:close={() => (tasklist = undefined)}>
    {#if tasklist != undefined}
        <h1 class="mb-3 text-xl font-bold">Editing Task List</h1>

        <TextInput variant="ghost" bind:value={tasklist.name} class="w-full rounded-none border-b-2 border-black" />
        <p class="mb-3 w-full text-left text-sm">Task List Name</p>

        <div class="flex-1 p-1" />

        <Button
            variant="unstyled"
            class="mb-3 w-full bg-red-700 text-white hover:brightness-90"
            on:click={() => {
                if (!confirm('Are you sure you want to delete this task?')) return;
                let ref = $workspace.tasklists.findIndex((a) => a.id == tasklist?.id);
                if (ref > -1) {
                    $workspace.tasklists.splice(ref, 1);
                    // eslint-disable-next-line no-self-assign
                    $workspace.tasklists = $workspace.tasklists;
                }
                tasklist = undefined;
            }}
        >
            Delete Task
        </Button>
        <div class="flex w-full flex-row items-center justify-end gap-3">
            <Button
                variant="unstyled"
                class="flex-1 bg-red-700 text-white hover:brightness-90"
                on:click={() => {
                    tasklist = undefined;
                }}
            >
                Discard Changes
            </Button>
            <Button
                variant="unstyled"
                class="h-full flex-1 bg-green-600 text-white hover:brightness-90"
                on:click={async () => {
                    let ref = $workspace.tasklists.findIndex((a) => a.id == tasklist?.id);
                    if (ref > -1) {
                        $workspace.tasklists[ref] = tasklist ?? newTasklist();
                    } else {
                        $workspace.tasklists = [...$workspace.tasklists, tasklist ?? newTasklist()];
                    }
                    tasklist = undefined;
                }}
            >
                Save Changes
            </Button>
        </div>
    {/if}
</SidebarModal>

<style>
    p {
        flex-shrink: 0;
    }
</style>
