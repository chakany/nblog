<script lang="ts">
    import { getTagValues } from "$lib/util"
    import type { PageData } from './$types';
    import FullPost from "$lib/FullPost.svelte"
    import { PUBLIC_NAME } from "$env/static/public";

    export let data: PageData;
</script>

<svelte:head>
    <title>{getTagValues(data.post.tags, "title")} - {PUBLIC_NAME}</title>
</svelte:head>

{#if data.post}
    <FullPost post={data.post} />
    {:else}
        No Data
{/if}