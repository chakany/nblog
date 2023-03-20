<script lang="ts">
    import ListPost from "$lib/ListPost.svelte"
    import type { PageData } from './$types';
    import { PUBLIC_NAME } from "$env/static/public";

    export let data: PageData;
    console.log(data)
</script>

<svelte:head>
    <title>Posts - {PUBLIC_NAME}</title>
</svelte:head>

{#if data.posts[0]}
    {#each data.posts as post, i}
        <div class="py-8">
            <ListPost post={post} />
        </div>
        {#if data.posts[i + 1]}
            <hr/>
        {/if}
    {/each}
{:else}
    No data
{/if}