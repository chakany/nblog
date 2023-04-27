<script lang="ts">
	import ListPost from "$lib/ListPost.svelte";
	import Tags from "$lib/Tags.svelte";
	import type { PageData } from "./$types";
	import { PUBLIC_NAME } from "$env/static/public";

	export let data: PageData;

	const tagList = data.tags.join(", ");
</script>

<svelte:head>
	<title>Tags {tagList} - {PUBLIC_NAME}</title>
	<meta property="og:title" content={"Tags " + tagList} />
</svelte:head>

<div class="flex-wrap text-3xl">
	<Tags tags={data.tags} />
</div>

{#if data.posts}
	{#each data.posts as post, i}
		<div class="py-8">
			<ListPost {post} />
		</div>
		{#if data.posts[i + 1]}
			<hr class="border-muted-dark" />
		{/if}
	{/each}
{:else}
	No data
{/if}
