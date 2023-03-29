import "websocket-polyfill";
import { SimplePool, type Event, getEventHash } from "nostr-tools";
import { PUBLIC_RELAYS, PUBLIC_PUBKEYS } from "$env/static/public";
import { browser } from "$app/environment";

export default class Nostr extends SimplePool {
	public relays: string[];
	public pubkeys: string[];
	public pubkey: string;

	constructor() {
		super();
		this.relays = PUBLIC_RELAYS.split(",");
		this.pubkeys = PUBLIC_PUBKEYS.split(",");
		this.pubkey = "";
	}

	public async connect() {
		for (let i = 0; i < this.relays.length; i++) {
			try {
				await this.ensureRelay(this.relays[i]);
			} catch (error) {
				// GFY
			}
		}
	}

	public getPubkey() {
		// @ts-expect-error we are literally checking if it is there
		if (browser && window.nostr) {
			// @ts-expect-error we already confirmed it's present
			return window.nostr.getPublicKey();
		}
	}

	public async signEvent(event: Event) {
		// @ts-expect-error we are checking
		if (browser && window.nostr) {
			// @ts-expect-error it's there
			event = await window.nostr.signEvent(event);
			this.pubkey = event.pubkey;
			return event;
		}

		return null;
	}
}
