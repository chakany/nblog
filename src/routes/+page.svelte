<script lang="ts">
    import "../app.css";
    import FullPost from "$lib/FullPost.svelte"
    import ListPost from "$lib/ListPost.svelte"
    import type { PageData } from './$types';
    import { PUBLIC_NAME } from "$env/static/public";

    export let data: PageData;
</script>

<svelte:head>
    <title>Home - {PUBLIC_NAME}</title>
</svelte:head>

{#if data.posts[0]}
    {#each data.posts as post, i}
        <div class="py-8">
            {#if i === 0}
                <FullPost post={post} />
            {:else}
                <ListPost post={post} />
            {/if}
        </div>
        {#if data.posts[i + 1]}
            <hr />
        {/if}
    {/each}
    {:else}
        No data
{/if}
