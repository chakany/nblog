import type { PageLoad } from './$types';
import Nostr from "$lib/Nostr"

export const load = (async ({ params }) => {
    const nostrClient = new Nostr()
    nostrClient.connect()
    return {
        post: await nostrClient.get(nostrClient.relays, { kinds: [30023], ids: [params.id], authors: nostrClient.pubkeys })
    }
}) satisfies PageLoad;