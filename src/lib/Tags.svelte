<script lang="ts">
	export let tags: string[] = [];
</script>

<div class="flex gap-2 font-mono">
	{#each tags as tag, i}
		<a
				href="/tags/{tag[1]}"
				target="_self"
				class="text-red-500"
		>
			#{tag[1]}
		</a>
		{#if tags[i + 1]}
			<span class="subtext">/</span>
		{/if}
	{/each}
</div>