import type { PageLoad } from "./$types";
import Nostr from "$lib/Nostr"
import type { Event } from "nostr-tools"
import { getTagValues } from "$lib/util";

export const load = (async ({ params }) => {
    const nostrClient = new Nostr()
    nostrClient.connect()
    const tagArr = params.tags.split(",")
    const sub = nostrClient.sub(nostrClient.relays, [
        {
            kinds: [30023],
            "#t": tagArr,
            authors: nostrClient.pubkeys
        }
    ])

    const posts: Event[] = [];

    sub.on('event', (event: Event) => {
        posts.push(event)
    })

    return {
        posts: new Promise<Event[]>((resolve) => {
            sub.on('eose', () => {
                sub.unsub()
                posts.sort((a, b) => Number(getTagValues(b.tags, "published_at")![0]) - Number(getTagValues(a.tags, "published_at")![0]))
                resolve(posts)
            })
        }),
        tags: tagArr,
    }
}) satisfies PageLoad;