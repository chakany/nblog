import { readable } from "svelte/store";
import Nostr from "$lib/Nostr";

export const nostr = readable(new Nostr());
