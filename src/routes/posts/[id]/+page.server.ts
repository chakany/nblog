import type { PageServerLoad } from "./$types";
import Nostr from "$lib/Nostr";
import { error } from "@sveltejs/kit";
import { PUBLIC_RELAYS } from "$env/static/public";

export const load = (async ({ params, setHeaders }) => {
	const nostrClient = new Nostr();
	const relays = PUBLIC_RELAYS.split(",");
	try {
		await nostrClient.connect(relays);
	} catch (err) {
		setHeaders({
			"cache-control": "no-cache",
		});
		throw error(500, {
			message: "Couldn't connect to relays",
		});
	}
	const sEvent = await nostrClient.get(relays, {
		kinds: [30023],
		"#d": [params.id],
		authors: nostrClient.pubkeys,
	});
	setHeaders({
		"cache-control": "public, max-age: 3600",
	});
	return {
		post: sEvent,
	};
}) satisfies PageServerLoad;
