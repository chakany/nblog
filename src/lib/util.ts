import type { Event } from "nostr-tools";

export function readingTime(text: string): number {
	const wpm = 225;
	const words = text.trim().split(/\s+/).length;
	return Math.ceil(words / wpm);
}

export function getTagValues(tags: string[][], name: string): string[] | null {
	const found = tags.find((v) => v[0] === name);
	if (!found) return null;
	const [, ...values] = found;
	return values;
}

// Used in the case where relays might not return replaceable events properly.
// Ex: multiple copies of the same event are returned.
export function removeDuplicates(events: Event[]): Event[] {
	const newPosts: Event[] = [];
	for (const e of events) {
		const eSlug = getTagValues(e.tags, "d");
		if (!eSlug) throw new Error("Invalid Event");
		if (
			newPosts.find((v) => {
				const vPub = getTagValues(v.tags, "d");
				if (!vPub) throw new Error("Invalid event");
				return vPub[0] === eSlug[0];
			})
		) {
			break;
		}
		const allD = events.filter((v) => {
			const vPub = getTagValues(v.tags, "d");
			if (!vPub) throw new Error("Invalid event");
			return vPub[0] === eSlug[0];
		});
		allD.sort((a, b) => {
			const aPub = getTagValues(a.tags, "published_at");
			const bPub = getTagValues(b.tags, "published_at");
			if (!aPub || !bPub) throw new Error("Invalid event");
			return Number(bPub[0]) - Number(aPub[0]);
		});
		newPosts.push(allD[0]);
	}

	return newPosts;
}
