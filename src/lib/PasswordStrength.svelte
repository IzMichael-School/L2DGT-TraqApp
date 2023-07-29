<script lang="ts">
    export let value: string;
    export { xclass as class };
    let xclass: string | undefined, result: Result;

    interface Result {
        score: number;
        feedback: {
            warning: string | undefined;
            suggestions: string[];
        };
    }

    import zxcvbn from 'zxcvbn';
    $: result = zxcvbn(value);
</script>

<div class="mb-2 ml-1 h-2 min-w-[12rem] shrink-0 overflow-hidden rounded-full bg-gray-100 {xclass}">
    <span
        class="block h-full bg-brand-green py-1 transition-all duration-300 ease-in-out"
        style="width: {(result.score / 4) * 100}%;"
    />
</div>

<p
    class="ml-1 w-fit overflow-hidden text-left text-sm italic text-red-700 {result.feedback?.warning?.length
        ? 'h-5'
        : 'h-0'} {xclass}"
>
    {result.feedback?.warning}
</p>

<p class="ml-1 w-fit text-left text-sm italic text-gray-700 {xclass}">
    {result.feedback?.suggestions.join(', ')}
</p>

<style>
</style>
