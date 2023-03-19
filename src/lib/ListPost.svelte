<script lang="ts">
    // @ts-ignore
    import { formatDistance } from "date-fns"
    import { type Event } from "nostr-tools";
    import { goto } from "$app/navigation";
    import { getTagValues, readingTime } from "$lib/util";
    export let post: Event;
    let image: string[]
</script>

<div>
    <small>
        Published {formatDistance(new Date(getTagValues(post.tags, "published_at")[0] * 1000), new Date(), { addSuffix: true })}
        {#if post.created_at !== Number(getTagValues(post.tags, "published_at")[0])}
            | Edited {formatDistance(new Date(post.created_at * 1000), new Date(), { addSuffix: true })}
        {/if}
        | {readingTime(post.content)} min read</small>
</div>
<a href={`/posts/${post.id}`} target="_self" class="flex cursor-pointer">
    <div class="flex-col">
        <h2 class="text-3xl font-bold">{getTagValues(post.tags, "title")[0]}</h2>
        <p class="subtext">{getTagValues(post.tags, "summary")[0]}</p>
    </div>
    {#if image = getTagValues(post.tags, "image")[0]}
        <img class="ml-auto rounded w-20 h-20 object-cover" src={image} alt="Post Image" />
    {/if}
</a>