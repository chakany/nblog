<script lang="ts">
	// @ts-expect-error weird error, don't know why it's there
	import { formatDistance } from "date-fns";
	import { nip19, nip05, type Event } from "nostr-tools";
	import SvelteMarkdown from "svelte-markdown";
	import { readingTime, getTagValues } from "$lib/util";
	import Tag from "$lib/Tag.svelte";
	import Fa from "svelte-fa";
	import { spring } from "svelte/motion";
	import { faLink, faCheck, faX, faEllipsis } from "@fortawesome/free-solid-svg-icons";
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
	let author: any;
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
				authors: [post.pubkey]
			}
		]);
		sub.on("event", (event: Event) => {
			if (event.kind == 7)
				reactions = [...reactions, event];
			else
				author = JSON.parse(event.content)
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
	let showPubkey = false;
	const npub = nip19.npubEncode(post.pubkey)
</script>

<div class="flex flex-col">
	<article>
		<div>
			<div class="subtext md:text-md flex text-sm lg:text-lg">
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
					<div
						class="cursor-pointer"
						on:mousedown={() => copyIconScale.set(0.8)}
						on:mouseup={() => copyIconScale.set(1)}
						on:click={() => navigator.clipboard.writeText(url)}
					>
						<Fa icon={faLink} scale={$copyIconScale} />
					</div>
					<a
						aria-label="Share to Twitter"
						class="ml-2"
						href="https://twitter.com/intent/tweet?url={url}"
						on:mousedown={() => tweetIconScale.set(0.8)}
						on:mouseup={() => tweetIconScale.set(1)}
					>
						<Fa icon={faTwitter} scale={$tweetIconScale} />
					</a>
				</div>
			</div>
			<h1 class="text-2xl underline font-extrabold sm:text-3xl md:text-4xl">
				<a href={url} target="_self">{title ? title[0] : "Title"}</a>
			</h1>
			<p class="subtext pt-1">{summary ? summary[0] : "Summary"}</p>
			<div class="flex my-3">
				<img class="rounded my-auto w-14 h-14" src={author && author.picture ? author.picture : `https://robohash.org/${post.pubkey}?sets=1`} alt="Profile" />
				<div class="flex flex-col my-auto pl-3">
					<div class="flex gap-1.5">
						<div>
							{#if author && author.display_name}
								{author.display_name}
							{:else if author && author.name}
								@{author.name}
							{/if}
						</div>
						{#if author && author.nip05}
							<div class="flex gap-1.5">
								{author.nip05}
								<span class="my-auto">
										{#await nip05.queryProfile(author.nip05)}
											<Fa icon={faEllipsis} />
										{:then profile}
											{#if profile.pubkey === post.pubkey}
												<Fa icon={faCheck} />
											{:else}
												<Fa icon={faX} />
											{/if}
										{:catch error}
											<Fa icon={faX} />
										{/await}
									</span>
							</div>
						{/if}
					</div>
					<span class="cursor-pointer" on:click={() => showPubkey = true}>
						{#if showPubkey}
							<a target="_self" href={"https://nosta.me/" + npub}>{npub}</a>
						{:else}
							Click to show npub
						{/if}
					</span>
				</div>
			</div>
			<div class="mt-2 flex flex-wrap gap-2">
				{#each post.tags.filter((v) => v[0] === "t") as tag}
					<Tag name={tag[1]} />
				{/each}
			</div>
		</div>
		<div class="flex flex-col items-center">
			<img
				class="object-fit my-5 max-w-sm rounded sm:max-w-md md:max-w-lg xl:max-w-2xl"
				src={image ? image[0] : "Image"}
				alt="Post"
			/>
			<div
				class="prose prose-lg dark:prose-invert prose-headings:underline prose-img:rounded-xl"
			>
				<SvelteMarkdown source={post.content} />
			</div>
		</div>
	</article>
	{#if PUBLIC_REACTIONS.toLowerCase() === "true"}
		<div class="mt-8 flex">
			<div class="mr-4" on:click={() => react("+")}>
				<Reaction
					label="👍"
					reactions={reactions.filter(
						(v) =>
							v.content === "👍" ||
							v.content === "+" ||
							v.content === "❤️" ||
							v.content === "🤙"
					)}
				/>
			</div>
			<div on:click={() => react("-")}>
				<Reaction
					label="👎"
					reactions={reactions.filter(
						(v) => v.content === "👎" || v.content === "-" || v.content === "💔"
					)}
				/>
			</div>
		</div>
	{/if}
</div>
