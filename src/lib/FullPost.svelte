<script lang="ts">
	import { type Event, nip19 } from "nostr-tools";
	import showdown from "showdown";
	import { readingTime, getTagValues } from "$lib/util";
	import Tags from "$lib/Tags.svelte";
	import Fa from "svelte-fa";
	import { spring } from "svelte/motion";
	import { faLink } from "@fortawesome/free-solid-svg-icons";
	import { faTwitter } from "@fortawesome/free-brands-svg-icons";
	import { onMount } from "svelte";
	import Reaction from "$lib/Reaction.svelte";
	import { nostr } from "$lib/stores";
	import { browser } from "$app/environment";
	import { PUBLIC_REACTIONS } from "$env/static/public";

	export let post: Event;

	const published_at = getTagValues(post.tags, "published_at");
	const title = getTagValues(post.tags, "title");
	const summary = getTagValues(post.tags, "summary");
	const image = getTagValues(post.tags, "image");
	const slug = getTagValues(post.tags, "d");

	let url: string;
	onMount(() => {
		// In cases where a full-length post is being displayed on the homepage
		// we want to copy the correct url, check if we are on posts path or not
		// if not, then without this we would return ex the home path and not the post path
		if (window.location.href.includes("posts")) {
			url = window.location.href;
		} else {
			url = window.location.href + "posts/" + getTagValues(post.tags, "d")[0];
		}
	});

	let reactions: Event[] = [];
	let author: unknown;
	if (browser) {
		$nostr.connect($nostr.relays);
	}
	// Reactions and profile
	if (browser && post) {
		let sub = $nostr.sub($nostr.relays, [
			{
				kinds: [7],
				"#e": [post.id],
				"#a": [`30023:${post.pubkey}:${slug[0]}`],
			},
			{
				kinds: [0],
				authors: [post.pubkey],
			},
		]);
		sub.on("event", (event: Event) => {
			if (event.kind == 7) reactions = [...reactions, event];
			else author = JSON.parse(event.content);
		});
	}

	async function react(reaction: string) {
		let event = {
			kind: 7,
			tags: [
				["client", "nblog"],
				["a", `30023:${post.pubkey}:${slug}`],
				["e", post.id],
				["p", post.pubkey],
			],
			created_at: Math.floor(Date.now() / 1000),
			content: reaction,
		};
		event = await $nostr.signEvent(event);
		if (!event) {
			// No Extension
		}
		if (reactions.find((r) => r.pubkey === $nostr.pubkey)) return;

		await $nostr.publish($nostr.relays, event);
	}

	let copyIconScale = spring(1);
	let tweetIconScale = spring(1);

	const converter = new showdown.Converter();
	const postContent = converter.makeHtml(post.content);
</script>

<div class="flex flex-col">
	<article>
		<div class="sm:px-14 md:px-4 xl:px-20 2xl:px-52">
			<div class="mt-2 flex">
				<div class="text-xs">
					<Tags tags={post.tags.filter((v) => v[0] === "t")} />
				</div>
				<div class="text-muted-bright ml-auto flex">
					<!-- svelte-ignore a11y-click-events-have-key-events -->
					<div
						class="transition-500 cursor-pointer transition-colors ease-linear hover:text-black hover:dark:text-white"
						on:mousedown={() => copyIconScale.set(0.8)}
						on:mouseleave={() => copyIconScale.set(1)}
						on:mouseup={() => copyIconScale.set(1)}
						on:click={() => navigator.clipboard.writeText(url)}
					>
						<Fa icon={faLink} scale={$copyIconScale} />
					</div>
					<a
						aria-label="Share to Twitter"
						class="transition-500 ml-2 transition-colors ease-linear hover:text-black hover:dark:text-white"
						href="https://twitter.com/intent/tweet?url={url}"
						on:mousedown={() => tweetIconScale.set(0.8)}
						on:mouseleave={() => tweetIconScale.set(1)}
						on:mouseup={() => tweetIconScale.set(1)}
					>
						<Fa icon={faTwitter} scale={$tweetIconScale} />
					</a>
				</div>
			</div>
			<h1 class="text-3xl font-bold md:text-4xl">
				<a href={url} target="_self">{title ? title[0] : "Title"}</a>
			</h1>
			<p class="text-muted-bright pt-1">{summary ? summary[0] : "Summary"}</p>
			<div class="my-3 flex">
				{#if author && author.picture}
					<img
						class="placeholder my-auto h-14 w-14 rounded-full"
						src={author.picture}
						alt="Profile"
					/>
				{:else if author}
					<img
						class="my-auto h-14 w-14 rounded-full"
						src={`https://robohash.org/${post.pubkey}?sets=1`}
						alt="Profile"
					/>
				{:else}
					<div class="placeholder my-auto h-14 w-14 rounded-full" />
				{/if}
				<div class="my-auto flex flex-col pl-3">
					<a
						class="gap-1.5 font-mono text-orange-600"
						href="/profile/{nip19.npubEncode(post.pubkey)}"
					>
						{#if author && author.display_name}
							{author.display_name}
						{:else if author && author.name}
							@{author.name}
						{:else if author}
							{nip19.npubEncode(post.pubkey)}
						{:else}
							<div class="placeholder h-5 rounded" />
						{/if}
					</a>
					<div>
						{new Date(
							published_at ? Number(published_at[0]) * 1000 : 0
						).toLocaleDateString()} <span class="text-muted-dark">/</span>
						{readingTime(post.content)} min read
					</div>
				</div>
			</div>
		</div>
		<div class="flex flex-col items-center">
			<img
				class="object-fit my-5 max-w-sm rounded sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl"
				src={image ? image[0] : "Image"}
				alt="Post"
			/>
			<div
				class="prose prose-lg prose-gray font-serif dark:prose-invert prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl prose-h4:text-lg prose-h5:text-base prose-h6:text-base prose-code:rounded prose-code:bg-gray-200 prose-img:rounded-xl prose-code:dark:bg-slate-900"
			>
				{@html postContent}
			</div>
		</div>
	</article>
	{#if PUBLIC_REACTIONS.toLowerCase() === "true"}
		<div class="mt-8 flex">
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div class="mr-4" on:click={() => react("+")}>
				<Reaction
					label="👍"
					count={reactions.filter(
						(v) =>
							v.content === "👍" ||
							v.content === "+" ||
							v.content === "❤️" ||
							v.content === "🤙"
					).length}
				/>
			</div>
			<!-- svelte-ignore a11y-click-events-have-key-events -->
			<div on:click={() => react("-")}>
				<Reaction
					label="👎"
					count={reactions.filter(
						(v) => v.content === "👎" || v.content === "-" || v.content === "💔"
					).length}
				/>
			</div>
		</div>
	{/if}
</div>
