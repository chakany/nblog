<script lang="ts">
	// @ts-ignore
	import { formatDistance } from "date-fns";
	import { type Event } from "nostr-tools";
	import SvelteMarkdown from "svelte-markdown";
	import { readingTime, getTagValues } from "$lib/util";
	import Tag from "$lib/Tag.svelte";
	import Fa from "svelte-fa";
	import { faLink } from "@fortawesome/free-solid-svg-icons";
	import { faTwitter } from "@fortawesome/free-brands-svg-icons";
	import { onMount } from "svelte";
	import Reaction from "$lib/Reaction.svelte";
	import { nostr } from "$lib/stores";
	import { browser } from "$app/environment";
	import { PUBLIC_REACTIONS } from "$env/static/public"

	export let post: Event;

	const published_at = getTagValues(post.tags, "published_at");
	const title = getTagValues(post.tags, "title");
	const summary = getTagValues(post.tags, "summary");
	const image = getTagValues(post.tags, "image");

	let url: string;
	onMount(() => {
		url = window.location.host + "/posts/" + post.id;
	});

	let reactions: Event[] = []
	if (browser) {
		$nostr.connect()
	}
	// Reactions
	if (browser && post) {
		let sub = $nostr.sub($nostr.relays, [
			{
				kinds: [7],
				"#e": [post.id]
			}
		])
		sub.on("event", (event: Event) => {
			console.log(event)
			reactions = [...reactions, event]
		})
	}

	async function react(reaction: string) {
		let event = {
			kind: 7,
			tags: [
					["client", "nblog"],
					["e", post.id]
			],
			created_at: Math.floor(Date.now() / 1000),
			content: reaction,
		}
		event = await $nostr.signEvent(event)
		if (!event) {
			// No Extension
		}
		if (reactions.find((r) => r.pubkey === $nostr.pubkey)) return;

		await $nostr.publish($nostr.relays, event)
	}
</script>

<div class="flex flex-col">
	<div>
		<div class="subtext flex">
			<div>
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
			<div class="my-auto ml-auto flex">
				<div class="cursor-pointer" on:click={() => navigator.clipboard.writeText(url)}>
					<Fa icon={faLink} />
				</div>
				<a class="ml-2" href="https://twitter.com/intent/tweet?url={url}">
					<Fa icon={faTwitter} />
				</a>
			</div>
		</div>
		<h1 class="text-5xl font-extrabold">{title ? title[0] : "Title"}</h1>
		<p class="subtext pt-1">{summary ? summary[0] : "Summary"}</p>
		<div class="mt-2 flex">
			{#each post.tags.filter((v) => v[0] === "t") as tag}
				<span class="mr-3"><Tag name={tag[1]} /></span>
			{/each}
		</div>
	</div>
	<div class="flex flex-col items-center">
		<img class="my-5 max-w-xl rounded object-fill" src={image ? image[0] : "Image"} alt="Post" />
		<article class="prose prose-lg dark:prose-invert prose-headings:underline prose-img:rounded-xl">
			<SvelteMarkdown source={post.content} />
		</article>
	</div>
	{#if PUBLIC_REACTIONS.toLowerCase() === "true"}
		<div class="flex mt-8">
			<div class="mr-4" on:click={() => react("+")}>
				<Reaction label="👍" reactions={reactions.filter((v) => v.content === "👍" || v.content === "+" || v.content === "❤️" || v.content === "🤙")} />
			</div>
			<div on:click={() => react("-")}>
				<Reaction label="👎" reactions={reactions.filter((v) => v.content === "👎" || v.content === "-" || v.content === "💔")} />
			</div>
		</div>
	{/if}
</div>
