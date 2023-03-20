<script lang="ts">
    // @ts-ignore
    import { formatDistance } from "date-fns"
    import { type Event } from "nostr-tools"
    import SvelteMarkdown from "svelte-markdown";
    import { readingTime, getTagValues } from "$lib/util";
    import Tag from "$lib/Tag.svelte"
    import Fa from 'svelte-fa'
    import { faLink } from '@fortawesome/free-solid-svg-icons'
    import { faTwitter, faLinkedin, faFacebook } from "@fortawesome/free-brands-svg-icons"
    import { onMount } from "svelte";

    export let post: Event

    const published_at = getTagValues(post.tags, "published_at")
    const title = getTagValues(post.tags, "title")
    const summary = getTagValues(post.tags, "summary")
    const image = getTagValues(post.tags, "image")

    let url: string
    onMount(() => {
        url = window.location.href
    })
</script>

<div class="flex flex-col items-center">
    <div>
        <div class="flex subtext">
            <div>
                Published {formatDistance(new Date(published_at ? Number(published_at[0]) * 1000: 0), new Date(), { addSuffix: true })}
                {#if post.created_at !== (published_at ? Number(published_at[0]): 0)}
                    | Edited {formatDistance(new Date(post.created_at * 1000), new Date(), { addSuffix: true })}
                {/if}
                | {readingTime(post.content)} min read
            </div>
            <div class="flex my-auto ml-auto">
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
        <div class="flex mt-2">
            {#each post.tags.filter((v) => v[0] === "t") as tag}
                <span class="mr-3"><Tag name={tag[1]} /></span>
            {/each}
        </div>
    </div>
    <img class="rounded max-w-xl my-5 object-fill" src={image ? image[0] : "Image"} alt="Post" />
    <article class="prose prose-lg dark:prose-invert prose-img:rounded-xl prose-headings:underline">
        <SvelteMarkdown source={post.content} />
    </article>
</div>