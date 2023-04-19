<script lang="ts">
	// @ts-expect-error weird error
	import { formatDistance } from "date-fns";
	import { type Event } from "nostr-tools";
	import { getTagValues, readingTime } from "$lib/util";
	export let post: Event;
	import Tags from "$lib/Tags.svelte";

	const published_at = getTagValues(post.tags, "published_at");
	const title = getTagValues(post.tags, "title");
	const summary = getTagValues(post.tags, "summary");
	const image = getTagValues(post.tags, "image");
</script>

<div class="md:text-md text-xs">
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
		<a
			class="flex cursor-pointer flex-col"
			href="/posts/{getTagValues(post.tags, 'd')[0]}"
			target="_self"
		>
			<h2 class="text-xl font-bold xl:text-3xl">{title ? title[0] : "Title"}</h2>
			<p class="subtext">{summary ? summary[0] : "Summary"}</p>
		</a>
		<div class="mt-2 flex flex-wrap gap-2">
			<Tags tags={post.tags.filter((v) => v[0] === "t")} />
		</div>
	</div>
	{#if image}
		<img
			class="ml-auto hidden h-20 w-20 rounded object-cover sm:inline"
			src={image[0]}
			alt="Banner"
		/>
	{/if}
</div>
