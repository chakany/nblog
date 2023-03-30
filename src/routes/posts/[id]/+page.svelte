<script lang="ts">
	import { getTagValues } from "$lib/util";
	import type { PageData } from "./$types";
	import FullPost from "$lib/FullPost.svelte";
	import { PUBLIC_NAME } from "$env/static/public";

	export let data: PageData;

	const oldTags = data.post.tags.filter((v) => v[0] === "t");
	let newTags = [];
	for (let i = 0; i < oldTags.length; i++) {
		newTags = [...newTags, oldTags[i][1]];
	}
</script>

<svelte:head>
	<title>{getTagValues(data.post.tags, "title")} - {PUBLIC_NAME}</title>
	<meta property="og:title" content={getTagValues(data.post.tags, "title")} />
	<meta property="og:image" content={getTagValues(data.post.tags, "image")} />
	<meta property="og:image:alt" content="Banner Image" />
	<meta property="og:description" content={getTagValues(data.post.tags, "summary")} />
	<meta name="description" content={getTagValues(data.post.tags, "summary")} />
	<meta name="keywords" content={newTags.join(", ")} />
</svelte:head>

{#if data.post}
	<FullPost post={data.post} />
{:else}
	No Data
{/if}
