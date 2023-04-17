import type { PageServerLoad } from "./$types";
import Nostr from "$lib/Nostr";
import type { Event } from "nostr-tools";
import { getTagValues, removeDuplicates } from "$lib/util";
import { error } from "@sveltejs/kit";
import { PUBLIC_RELAYS } from "$env/static/public";

export const ssr = true;

export const load = (async ({ setHeaders }) => {
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
	setHeaders({
		"cache-control": "public, max-age: 3600",
	});
	const sub = nostrClient.sub(relays, [
		{
			kinds: [30023],
			authors: nostrClient.pubkeys,
		},
	]);

	let posts: Event[] = [];

	sub.on("event", (event: Event) => {
		posts.push(event);
	});

	return {
		posts: new Promise<Event[]>((resolve) => {
			sub.on("eose", () => {
				sub.unsub();
				if (posts.length == 0) {
					resolve(posts);
				}
				posts = removeDuplicates(posts);
				posts.sort(
					(a, b) =>
						Number(getTagValues(b.tags, "published_at")![0]) -
						Number(getTagValues(a.tags, "published_at")![0])
				);
				resolve(posts);
			});
		}),
	};
}) satisfies PageServerLoad;
