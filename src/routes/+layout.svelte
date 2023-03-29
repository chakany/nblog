<script lang="ts">
	import "../app.css";
	import "@fontsource/noto-serif-lao";
	import { PUBLIC_NAME, PUBLIC_PICTURE } from "$env/static/public";
</script>

<svelte:head>
	<title>{PUBLIC_NAME}</title>
	<link rel="icon" type="image/x-icon" href={PUBLIC_PICTURE} />
</svelte:head>

<nav class="mx-10 my-6 flex md:mx-20">
	<a href="/" target="_self" class="my-auto flex">
		<img class="my-auto w-14 rounded" src={PUBLIC_PICTURE} alt="Header" />
		<span class="my-auto ml-2">{PUBLIC_NAME}</span>
	</a>
	<div class="my-auto ml-10 flex">
		<ul>
			<li><a class="underline" href="/posts" target="_self">Posts</a></li>
		</ul>
	</div>
</nav>
<hr />

<div class="container px-6 md:px-24 lg:px-52 py-8">
	<slot />
</div>

<hr />
<footer class="my-6 mx-6 flex">
	<div class="mr-auto">
		Powered by <a class="underline" href="https://github.com/jacany/nblog">nblog</a>
	</div>
	<div>
		This website is published under the <a
			class="underline"
			href="https://github.com/jacany/nblog/tree/master/LICENSE">MIT License</a
		>
	</div>
</footer>

<style lang="postcss">
	:global(html, body) {
		font-family: "Noto Serif Lao", serif;
		@apply dark:bg-black dark:text-white;
	}

	:global(.subtext) {
		@apply text-slate-500 dark:text-gray-300;
	}
</style>
