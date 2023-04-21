<script lang="ts">
	export let tags: string[] = [];
</script>

<div class="flex flex-wrap gap-2 font-mono">
	{#each tags as tag, i}
		<a
				href="/tags/{tag[1]}"
				target="_self"
				class="text-orange-600"
		>
			#{tag[1]}
		</a>
		{#if tags[i + 1]}
			<span class="muted-dark">/</span>
		{/if}
	{/each}
</div>