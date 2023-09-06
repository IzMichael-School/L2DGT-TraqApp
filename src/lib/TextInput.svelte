<script lang="ts">
    // Declare Props
    export let value = '',
        name = '',
        subtitle = '',
        placeholder = '',
        autocomplete = '',
        autocorrect: 'false' | 'true' = 'true',
        secret: boolean | undefined = undefined,
        variant: keyof typeof variants = 'default',
        subtitleClass: string | undefined = '';
    export { xclass as class };
    let xclass: string | undefined;

    // Declare style variants
    const variants = {
        default: 'bg-gray-100 text-black hover:bg-gray-200',
        outline: 'bg-transparent border border-gray-400 hover:bg-gray-100 hover:border-gray-900',
        ghost: 'bg-transparent hover:bg-gray-100',
    };
</script>

<!-- If input type is secret, use password input, else use text -->
{#if secret == undefined}
    <input
        type="text"
        {name}
        {placeholder}
        {autocomplete}
        {autocorrect}
        bind:value
        class="{xclass} my-1 min-w-[12rem] rounded-lg p-2 font-normal outline-none transition-colors duration-200 ease-in-out {variants[
            variant
        ]}"
    />
{:else}
    <input
        type="password"
        {name}
        {placeholder}
        {autocomplete}
        {autocorrect}
        bind:value
        class="{xclass} my-1 min-w-[12rem] rounded-lg p-2 font-normal outline-none transition-colors duration-200 ease-in-out {variants[
            variant
        ]}"
    />
{/if}

<!-- Add subtitle, if specified -->
<p class="{subtitleClass} ml-1 min-w-fit text-left text-sm italic text-gray-700">
    {subtitle}
</p>

<style>
</style>
