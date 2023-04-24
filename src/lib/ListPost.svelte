<script lang="ts">
	import { type Event } from "nostr-tools";
	import { getTagValues, readingTime } from "$lib/util";
	export let post: Event;
	import Tags from "$lib/Tags.svelte";

	const published_at = getTagValues(post.tags, "published_at");
	const title = getTagValues(post.tags, "title");
	const summary = getTagValues(post.tags, "summary");
	const image = getTagValues(post.tags, "image");
</script>

<div class="flex font-display">
	<div class="my-auto flex flex-col">
		<div class="mt-2">
			<Tags tags={post.tags.filter((v) => v[0] === "t")} />
		</div>
		<a
			class="flex cursor-pointer flex-col"
			href="/posts/{getTagValues(post.tags, 'd')[0]}"
			target="_self"
		>
			<h2 class="text-xl font-bold xl:text-3xl">{title ? title[0] : "Title"}</h2>
			<div class="md:text-md text-xs">
				{new Date(published_at ? Number(published_at[0]) * 1000 : 0).toLocaleDateString()}
				<span class="muted-dark">/</span>
				{readingTime(post.content)} min read
			</div>
			<p class="muted-bright">{summary ? summary[0] : "Summary"}</p>
		</a>
	</div>
	{#if image}
		<img
			class="my-auto ml-auto hidden h-20 w-20 rounded object-cover sm:inline"
			src={image[0]}
			alt="Banner"
		/>
	{/if}
</div>
