export function readingTime(text: string): number {
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm)
}

export function getTagValues(tags: any[], name: string): any[] | null {
    const [tagName, ...values] = tags.find((v) => v[0] === name)
    if (!tagName) return null
    return values
}