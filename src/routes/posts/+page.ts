import type { PageLoad } from "./$types";
import Nostr from "$lib/Nostr";
import type { Event } from "nostr-tools";
import { getTagValues } from "$lib/util";
import { error } from "@sveltejs/kit";

export const ssr = true;
export const csr = false;

export const load = (async ({ setHeaders }) => {
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
	setHeaders({
		"cache-control": "public, max-age: 3600",
	});
	const sub = nostrClient.sub(nostrClient.relays, [
		{
			kinds: [30023],
			authors: nostrClient.pubkeys,
		},
	]);

	const posts: Event[] = [];

	sub.on("event", (event: Event) => {
		posts.push(event);
	});

	return {
		posts: new Promise<Event[]>((resolve) => {
			sub.on("eose", () => {
				if (posts.length == 0) {
					resolve(posts);
				}
				sub.unsub();
				posts.sort(
					(a, b) =>
						Number(getTagValues(b.tags, "published_at")![0]) -
						Number(getTagValues(a.tags, "published_at")![0])
				);
				resolve(posts);
			});
		}),
	};
}) satisfies PageLoad;
