<script lang="ts">
    // @ts-ignore
    import { formatDistance } from "date-fns"
    import { type Event } from "nostr-tools"
    import SvelteMarkdown from "svelte-markdown";
    import { readingTime, getTagValues } from "$lib/util";

    export let post: Event
</script>

<div class="flex flex-col items-center">
    <div>
        <div>
            Published {formatDistance(new Date(post.created_at * 1000), new Date(), { addSuffix: true })}
            {#if post.created_at !== Number(getTagValues(post.tags, "published_at")[0])}
                | Edited {formatDistance(new Date(post.created_at * 1000), new Date(), { addSuffix: true })}
            {/if}
            |
            {readingTime(post.content)} min read
        </div>
        <h1 class="text-5xl font-extrabold">{getTagValues(post.tags, "title")[0]}</h1>
        <p class="subtext pt-1">{getTagValues(post.tags, "summary")[0]}</p>
    </div>
    <img class="rounded max-w-xl my-5 object-fill" src={getTagValues(post.tags, "image")[0]} alt="Post" />
    <article class="prose prose-lg dark:prose-invert prose-img:rounded-xl prose-headings:underline">
        <SvelteMarkdown source={post.content} />
    </article>
</div>