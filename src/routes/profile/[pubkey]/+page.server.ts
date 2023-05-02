import type { PageServerLoad } from "./$types";
import Nostr from "$lib/Nostr";
import { nip19 } from "nostr-tools";
import type { Event } from "nostr-tools";
import { getTagValues, removeDuplicates } from "$lib/util";
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
	let pubkey = params.pubkey;
	if (pubkey.startsWith("npub") || pubkey.startsWith("nprofile")) {
		const decode = nip19.decode(pubkey);
		if (typeof decode.data == "string") {
			pubkey = decode.data;
		} else {
			// @ts-expect-error we verified it's there already
			pubkey = decode.data.pubkey;
		}
	}

	if (!nostrClient.pubkeys.includes(pubkey)) {
		setHeaders({
			"cache-control": "no-cache",
		});
		throw error(404, {
			message: "Author not found",
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
		{
			kinds: [0],
			authors: [pubkey],
		},
	]);

	let posts: Event[] = [];
	let profile: Event | null = null;

	sub.on("event", (event: Event) => {
		if (event.kind == 30023) {
			posts.push(event);
		} else if (event.kind == 0) {
			profile = event;
		}
	});

	return {
		posts: new Promise<Event[]>((resolve) => {
			sub.on("eose", () => {
				sub.unsub();
				if (posts.length == 0) {
					resolve(posts);
				}
				posts = removeDuplicates(posts);
				posts.sort((a, b) => {
					const aPub = getTagValues(a.tags, "published_at");
					const bPub = getTagValues(b.tags, "published_at");
					if (!aPub || !bPub) throw new Error("Invalid event");
					return Number(bPub[0]) - Number(aPub[0]);
				});
				resolve(posts);
			});
		}),
		profile: new Promise<Event | null>((resolve) => {
			sub.on("eose", () => {
				resolve(profile);
			});
		}),
	};
}) satisfies PageServerLoad;
