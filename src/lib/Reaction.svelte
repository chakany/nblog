<script lang="ts">
    import { type Event } from "nostr-tools";
    export let label = "+";
    export let reactions: Event[] = [];
</script>

<span class="flex py-1 px-4 rounded border border-solid border-black dark:border-white cursor-pointer">
    <span class="mr-2">{reactions.length}</span>
    <span>{label}</span>
</span>