<script lang="ts">
	import { type Event } from "nostr-tools";
	export let label = "+";
	export let reactions: Event[] = [];
</script>

<span
	class="flex cursor-pointer rounded border border-solid border-black py-1 px-4 dark:border-white"
>
	<span class="mr-2">{reactions.length}</span>
	<span>{label}</span>
</span>
