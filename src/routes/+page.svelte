<script lang="ts">
	import "../app.css";
	import FullPost from "$lib/FullPost.svelte";
	import ListPost from "$lib/ListPost.svelte";
	import type { PageData } from "./$types";
	import { PUBLIC_NAME } from "$env/static/public";

	export let data: PageData;
</script>

<svelte:head>
	<title>Home - {PUBLIC_NAME}</title>
	<meta property="og:title" content="Home" />
</svelte:head>

{#if data.posts}
	{#each data.posts as post, i}
		<div class={data.posts[i + 1] ? "pb-8" : ""}>
			{#if i === 0}
				<FullPost {post} />
			{:else}
				<ListPost {post} />
			{/if}
		</div>
		{#if data.posts[i + 1]}
			<div class="pb-8">
				<hr class="border-muted-dark" />
			</div>
		{/if}
	{/each}
{:else}
	No data
{/if}
