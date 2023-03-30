<script lang="ts">
	// @ts-ignore
	import { formatDistance } from "date-fns";
	import { type Event } from "nostr-tools";
	import { getTagValues, readingTime } from "$lib/util";
	export let post: Event;
	import Tag from "$lib/Tag.svelte";

	const published_at = getTagValues(post.tags, "published_at");
	const title = getTagValues(post.tags, "title");
	const summary = getTagValues(post.tags, "summary");
	const image = getTagValues(post.tags, "image");
</script>

<div class="text-xs md:text-md">
	Published {formatDistance(
		new Date(published_at ? Number(published_at[0]) * 1000 : 0),
		new Date(),
		{ addSuffix: true }
)}
	{#if post.created_at !== (published_at ? Number(published_at[0]) : 0)}
		| Edited {formatDistance(new Date(post.created_at * 1000), new Date(), {
		addSuffix: true,
	})}
	{/if}
	| {readingTime(post.content)} min read
</div>
<div class="flex">
	<div class="flex flex-col">
		<a class="flex cursor-pointer flex-col" href="/posts/{getTagValues(post.tags, 'd')[0]}" target="_self">
			<h2 class="text-xl xl:text-3xl font-bold">{title ? title[0] : "Title"}</h2>
			<p class="subtext">{summary ? summary[0] : "Summary"}</p>
		</a>
		<div class="mt-2 flex">
			{#each post.tags.filter((v) => v[0] === "t") as tag}
				<span class="mr-3"><Tag name={tag[1]} /></span>
			{/each}
		</div>
	</div>
	{#if image}
		<img class="hidden sm:inline ml-auto h-20 w-20 rounded object-cover" src={image[0]} alt="Post Image" />
	{/if}
</div>
