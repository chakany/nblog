<script lang="ts">
	export let tags: string[] | string[][] = [];
	const isNostr = Array.isArray(tags[0]) && tags[0][0] === `t`;
</script>

<div class="flex flex-wrap gap-2 font-mono">
	{#each tags as tag, i}
		<a href="/tags/{isNostr ? tag[1] : tag}" target="_self" class="text-orange-600">
			#{isNostr ? tag[1] : tag}
		</a>
		{#if tags[i + 1]}
			<span class="text-muted-dark">/</span>
		{/if}
	{/each}
</div>
