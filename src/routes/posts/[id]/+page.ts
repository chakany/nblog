import type { PageLoad } from './$types';
import Nostr from "$lib/Nostr"
import { error } from "@sveltejs/kit";

export const ssr = true;
export const csr = true;

export const load = (async ({ params }) => {
    const nostrClient = new Nostr()
    try {
        await nostrClient.connect()
    } catch (err) {
        throw error(500, {
            message: "Couldn't connect to relays"
        })
    }
    return {
        post: await nostrClient.get(nostrClient.relays, { kinds: [30023], ids: [params.id], authors: nostrClient.pubkeys })
    }
}) satisfies PageLoad;