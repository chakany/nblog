<script lang="ts">
    // @ts-ignore
    import { formatDistance } from "date-fns"
    import { type Event } from "nostr-tools";
    import { getTagValues, readingTime } from "$lib/util";
    export let post: Event;
    import Tag from "$lib/Tag.svelte";

    const published_at = getTagValues(post.tags, "published_at")
    const title = getTagValues(post.tags, "title")
    const summary = getTagValues(post.tags, "summary")
    const image = getTagValues(post.tags, "image")
</script>

<div>
    <small>
        Published {formatDistance(new Date(published_at ? Number(published_at[0]) * 1000: 0), new Date(), { addSuffix: true })}
        {#if post.created_at !== (published_at ? Number(published_at[0]): 0)}
            | Edited {formatDistance(new Date(post.created_at * 1000), new Date(), { addSuffix: true })}
        {/if}
        | {readingTime(post.content)} min read
    </small>
</div>
<div class="flex">
    <div class="flex flex-col">
        <a class="flex flex-col cursor-pointer" href="/posts/{post.id}" target="_self">
            <h2 class="text-3xl font-bold">{title ? title[0] : "Title"}</h2>
            <p class="subtext">{summary ? summary[0] : "Summary"}</p>
        </a>
        <div class="flex mt-2">
            {#each post.tags.filter((v) => v[0] === "t") as tag}
                <span class="mr-3"><Tag name={tag[1]} /></span>
            {/each}
        </div>
    </div>
    {#if image}
        <img class="ml-auto rounded w-20 h-20 object-cover" src={image[0]} alt="Post Image" />
    {/if}
</div>