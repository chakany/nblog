import type { RequestHandler } from "./$types";
import Nostr from "$lib/Nostr";
import { nip19 } from "nostr-tools";
import type { Event } from "nostr-tools";
import { getTagValues, removeDuplicates } from "$lib/util";
import { error } from "@sveltejs/kit";
import { PUBLIC_RELAYS, PUBLIC_NAME, PUBLIC_PICTURE } from "$env/static/public";
import { version } from "$app/environment";
import showdown from "showdown";

const buildFeed = (events: Event[], origin: string) => {
	const convertTime = (unixTime: number): string => {
		const date = new Date(unixTime * 1000);
		return date.toISOString();
	};
	const escapeHtml = (text: string) => {
		const map = {
			"&": "&amp;",
			"<": "&lt;",
			">": "&gt;",
			'"': "&quot;",
			"'": "&#039;",
		};

		return text.replace(/[&<>"']/g, (m) => {
			// @ts-expect-error THIS IS FUCKING STUPID
			return map[m];
		});
	};
	// start the structure, we are using arrays because they are dead simple and w e can combine them later.
	let feed = [
		'<?xml version="1.0" encoding="UTF-8" ?>',
		'<feed xmlns="http://www.w3.org/2005/Atom">',
		`<id>${origin}</id>`,
		`<title>${PUBLIC_NAME}</title>`,
		`<link rel="self" href="${origin}" />`,
		`<updated>${convertTime(events[0].created_at)}</updated>`,
		`<generator version="${version}">nblog</generator>`,
		`<subtitle>Powered by nblog</subtitle>`,
		`<icon>${PUBLIC_PICTURE}</icon>`,
	];
	const converter = new showdown.Converter();
	const addPost = (event: Event) => {
		const title = getTagValues(event.tags, "title");
		const summary = getTagValues(event.tags, "summary");
		const slug = getTagValues(event.tags, "d");
		const publishedAt = Number(getTagValues(event.tags, "published_at")![0]);
		const url = origin + "/posts/" + slug![0];
		const post = [
			`<entry>`,
			`<id>${url}</id>`,
			`<title>${title ? title![0] : "No Title"}</title>`,
			`<summary>${summary ? summary![0] : "No Description"}</summary>`,
			`<link rel="self" href="${url}" />`,
			`<content type="application/html">${escapeHtml(
				converter.makeHtml(event.content)
			)}</content>`,
			`<published>${convertTime(publishedAt)}</published>`,
			publishedAt != event.created_at ? `<updated>${convertTime(publishedAt)}</updated>` : "",
		];
		for (const tag of event.tags.filter((v) => v[0] === "t")) {
			post.push(`<category term="${tag[1]}" />`);
		}
		post.push(`</entry>`);
		// Assign
		feed = [...feed, ...post];
	};

	for (const event of events) {
		addPost(event);
	}

	feed = [...feed, `</feed>`];
	return feed.join("\n");
};

export const GET = (async ({ setHeaders, url }) => {
	const nostrClient = new Nostr();
	const relays = PUBLIC_RELAYS.split(",");
	try {
		await nostrClient.connect(relays);
	} catch (err) {
		throw error(500, {
			message: "Couldn't connect to relays",
		});
	}
	setHeaders({
		"cache-control": "public, max-age: 3600",
		"Content-Type": "application/atom+xml",
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

	const waitFor = await new Promise<string>((resolve) => {
		sub.on("eose", () => {
			sub.unsub();
			let feed: string;
			if (posts.length == 0) {
				feed = buildFeed(posts, url.origin);
				resolve(feed);
			}
			posts = removeDuplicates(posts);
			posts.sort(
				(a, b) =>
					Number(getTagValues(b.tags, "published_at")![0]) -
					Number(getTagValues(a.tags, "published_at")![0])
			);
			feed = buildFeed(posts, url.origin);
			resolve(feed);
		});
	});

	return new Response(waitFor);
}) satisfies RequestHandler;
