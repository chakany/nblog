<script lang="ts">
	import "../app.css";
	import { PUBLIC_NAME, PUBLIC_PICTURE } from "$env/static/public";
	import { onMount } from "svelte";
	import { version } from "$app/environment";

	let url: string;
	onMount(() => {
		url = window.location.href;
	});
</script>

<svelte:head>
	<meta property="og:site_name" content={PUBLIC_NAME} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={url} />
	<link rel="icon" type="image/x-icon" href={PUBLIC_PICTURE} />
	<meta name="theme-color" media="(prefers-color-scheme: light)" content="#FFF" />
	<meta name="theme-color" media="(prefers-color-scheme: dark)" content="#000" />
	<meta name="description" content="Home Page" />
</svelte:head>

<header>
	<nav class="flex px-10 py-6 md:px-20">
		<a class="font-extrabold" href="/" target="_self">
			{PUBLIC_NAME}
		</a>
		<div class="ml-auto uppercase font-semibold">
			<ul class="flex sm:gap-2 lg:gap-4">
				<li><a class="px-3 py-2" href="/" target="_self">Home</a></li>
				<li><a class="px-3 py-2" href="/posts" target="_self">Posts</a></li>
				<li><a class="px-3 py-2" href="/atom" target="_self">Feed</a></li>
			</ul>
		</div>
	</nav>
</header>

<main class="container px-6 py-8 md:px-24 lg:px-52">
	<slot />
</main>

<hr class="border-muted-light" />
<footer class="mx-6 my-6 flex text-xs">
	<div class="mr-auto">
		Powered by <a class="underline" href="https://github.com/jacany/nblog">nblog</a> v{version}
	</div>
	<div class="text-right">
		This website is published under the <a
			class="underline"
			href="https://github.com/jacany/nblog/tree/master/LICENSE">MIT License</a
		>
	</div>
</footer>

<style lang="postcss">
	:global(html, body) {
		@apply font-sans subpixel-antialiased dark:bg-[#242731] dark:text-white;
	}
</style>
