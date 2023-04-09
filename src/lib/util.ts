import type { Event } from "nostr-tools";

export function readingTime(text: string): number {
	const wpm = 225;
	const words = text.trim().split(/\s+/).length;
	return Math.ceil(words / wpm);
}

export function getTagValues(tags: string[][], name: string): any[] | null {
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
		if (newPosts.find((v) => getTagValues(v.tags, "d")![0] === getTagValues(e.tags, "d")![0])) {
			break;
		}
		const allD = events.filter(
			(v) => getTagValues(v.tags, "d")![0] === getTagValues(e.tags, "d")![0]
		);
		allD.sort(
			(a, b) =>
				Number(getTagValues(b.tags, "published_at")![0]) -
				Number(getTagValues(a.tags, "published_at")![0])
		);
		newPosts.push(allD[0]);
	}

	return newPosts;
}
