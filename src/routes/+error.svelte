<script lang="ts">
    // Import error data
    import { page } from '$app/stores';
</script>

<!-- Display error data -->
<div class="flex h-full w-full flex-col items-center justify-center">
    <h1 class="font-title mb-5 w-full text-center text-3xl font-bold">{$page.status} - {$page.error?.message}</h1>
    <a href="/" data-sveltekit-reload class="mb-2 font-medium hover:underline">Return Home?</a>
</div>
