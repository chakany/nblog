<script lang="ts">
	import { type Event } from "nostr-tools";
	export let label = "+";
	export let reactions: Event[] = [];
</script>

<span
	class="flex cursor-pointer rounded border border-solid border-black px-4 py-1 dark:border-white"
>
	<span class="mr-2">{reactions.length}</span>
	<span>{label}</span>
</span>
