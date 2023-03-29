<script lang="ts">
	import { getTagValues } from "$lib/util";
	import type { PageData } from "./$types";
	import FullPost from "$lib/FullPost.svelte";
	import { PUBLIC_NAME } from "$env/static/public";
	import {onMount} from "svelte";

	export let data: PageData;
</script>

<svelte:head>
	<title>{getTagValues(data.post.tags, "title")} - {PUBLIC_NAME}</title>
	<meta property="og:title" content={getTagValues(data.post.tags, "title")} />
	<meta property="og:image" content={getTagValues(data.post.tags, "image")} />
	<meta property="og:image:alt" content="Banner Image" />
	<meta property="og:description" content={getTagValues(data.post.tags, "summary")} />
</svelte:head>

{#if data.post}
	<FullPost post={data.post} />
{:else}
	No Data
{/if}
