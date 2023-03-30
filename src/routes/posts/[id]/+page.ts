import type { PageLoad } from "./$types";
import Nostr from "$lib/Nostr";
import { error } from "@sveltejs/kit";

export const ssr = true;
export const csr = true;

export const load = (async ({ params, setHeaders }) => {
	const nostrClient = new Nostr();
	try {
		await nostrClient.connect();
	} catch (err) {
		setHeaders({
			"cache-control": "no-cache",
		});
		throw error(500, {
			message: "Couldn't connect to relays",
		});
	}
	// TODO: remove
	const idEvent = await nostrClient.get(nostrClient.relays, {
		kinds: [30023],
		ids: [params.id],
		authors: nostrClient.pubkeys,
	})
	const sEvent = await nostrClient.get(nostrClient.relays, {
		kinds: [30023],
		"#d": [params.id],
		authors: nostrClient.pubkeys,
	})
	setHeaders({
		"cache-control": "public, max-age: 3600",
	});
	return {
		post: idEvent ?? sEvent,
	};
}) satisfies PageLoad;
