export function readingTime(text: string): number {
    const wpm = 225;
    const words = text.trim().split(/\s+/).length;
    return Math.ceil(words / wpm)
}

export function getTagValues(tags: any[], name: string): any[] | null {
    // If it wasn't wrapped in an array then running .shift would remove it from
    // the original event itself, which we don't want
    const tag = [...tags.find((v) => v[0] === name)]
    if (!tag) return null
    tag.shift()
    return tag
}