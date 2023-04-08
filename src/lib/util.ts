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
	const newEvents: Event[] = [];
	// TODO: this is provably very inefficient
	for (const top of events) {
		const topTag = getTagValues(top.tags, "d");
		if (!topTag) break;

		for (const bottom of events) {
			const bottomTag = getTagValues(bottom.tags, "d");
			if (!bottomTag) break;

			if (topTag[0] === bottomTag[0] && top.id !== bottom.id) {
				if (top.created_at > bottom.created_at && !newEvents.includes(top)) {
					newEvents.push(top);
				} else if (top.created_at < bottom.created_at && !newEvents.includes(bottom)) {
					newEvents.push(bottom);
				}

				break;
			}
			if (!newEvents.includes(top)) {
				newEvents.push(top);
			}
			if (!newEvents.includes(bottom)) {
				newEvents.push(bottom);
			}
		}
	}

	return newEvents;
}
