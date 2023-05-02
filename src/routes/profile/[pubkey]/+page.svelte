<script lang="ts">
	import type { PageData } from "./$types";
	import Fa from "svelte-fa";
	import { faLink, faBolt, faCheck, faX } from "@fortawesome/free-solid-svg-icons";
	import showdown from "showdown";
	import ListPost from "$lib/ListPost.svelte";
	import { nip05, nip19 } from "nostr-tools";

	export let data: PageData;
	$: profile = JSON.parse(data.profile.content);
	$: console.debug(profile);

	const converter = new showdown.Converter();
	converter.setOption("simpleLineBreaks", true);
	$: aboutContent = converter.makeHtml(profile.about);
	let showNpub = false;
</script>

<div class="flex gap-10 font-sans max-sm:flex-col sm:gap-20">
	<div class="flex max-sm:gap-24 sm:flex-col">
		{#if profile && profile.picture}
			<img
				class="placeholder my-5 h-24 w-24 rounded-full"
				src={profile.picture}
				alt="Profile"
			/>
		{:else if profile}
			<img
				class="my-5 h-24 w-24 rounded-full"
				src={`https://robohash.org/${data.profile.pubkey}?sets=1`}
				alt="Profile"
			/>
		{:else}
			<div class="placeholder my-5 h-24 w-24 rounded-full" />
		{/if}
		<div class="flex flex-col max-sm:my-auto">
			{#if showNpub}
				<div class="break-all">
					{nip19.npubEncode(data.profile.pubkey)}
				</div>
			{:else}
				<div class="cursor-pointer" on:click={() => (showNpub = true)}>
					Click to show npub
				</div>
			{/if}
			{#if profile && profile.nip05}
				<div class="flex gap-1">
					<span class="my-auto">
						{#await nip05.queryProfile(profile.nip05)}
							?
						{:then fetched}
							{#if data.profile.pubkey === fetched.pubkey}
								<Fa icon={faCheck} />
							{:else}
								<Fa icon={faX} />
							{/if}
						{:catch error}
							<Fa icon={faX} />
						{/await}
					</span>
					{profile.nip05}
				</div>
			{/if}
			{#if profile && profile.website}
				<a class="flex gap-1 text-orange-600" href={profile.website}>
					<span class="my-auto"><Fa icon={faLink} /></span>
					{profile.website}
				</a>
			{/if}
			{#if profile && profile.lud16}
				<a class="flex gap-1 text-orange-600" href="https://sendsats.to/{profile.lud16}">
					<span class="my-auto"><Fa icon={faBolt} /></span>
					{profile.lud16}
				</a>
			{/if}
		</div>
	</div>

	<div class="flex flex-col">
		<span class="font-semibold uppercase">About</span>
		<h1 class="text-3xl font-bold md:text-4xl">
			{#if profile && profile.display_name}
				{profile.display_name}
			{:else if profile && profile.name}
				@{profile.name}
			{:else}
				No Name Provided
			{/if}
		</h1>
		<p>
			{#if aboutContent}
				{@html aboutContent}
			{:else}
				No Bio
			{/if}
		</p>
		<hr class="border-muted-dark my-5" />
		<h2 class="font-semibold text-2xl">Posts Authored</h2>
		{#if data.posts[0]}
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
	</div>
</div>
