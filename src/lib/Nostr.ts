import "websocket-polyfill"
import { SimplePool } from "nostr-tools"
import { PUBLIC_RELAYS, PUBLIC_PUBKEYS } from "$env/static/public"

export default class Nostr extends SimplePool {
    public relays: string[];
    public pubkeys: string[];

    constructor() {
        super();
        this.relays = PUBLIC_RELAYS.split(",")
        this.pubkeys = PUBLIC_PUBKEYS.split(",")
    }

    public async connect() {
        for (let i = 0; i < this.relays.length; i++) {
            await this.ensureRelay(this.relays[i])
        }
    }
}