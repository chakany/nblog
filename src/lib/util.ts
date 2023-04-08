export function readingTime(text: string): number {
	const wpm = 225;
	const words = text.trim().split(/\s+/).length;
	return Math.ceil(words / wpm);
}

export function getTagValues(tags: any[], name: string): any[] | null {
	const found = tags.find((v) => v[0] === name);
	if (!found) return null;
	const [, ...values] = found;
	return values;
}
