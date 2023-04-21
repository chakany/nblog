<script lang="ts">
	import "../app.css";
	import "@fontsource/source-sans-pro";
	import { PUBLIC_NAME, PUBLIC_PICTURE } from "$env/static/public";
	import { faSquareRss } from "@fortawesome/free-solid-svg-icons";
	import Fa from "svelte-fa";
	import { onMount } from "svelte";
	import { version } from "$app/environment";

	export const ssr = true;
	export const csr = true;

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
		<a href="/atom" target="_self" class="my-auto ml-auto flex">
			<Fa icon={faSquareRss} scale={2} />
		</a>
	</nav>
</header>
<hr />

<main class="container px-6 py-8 md:px-24 lg:px-52">
	<slot />
</main>

<hr />
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
		font-family: "Source Sans Pro", sans-serif;
		@apply subpixel-antialiased dark:bg-black dark:text-white;
	}

	:global(.subtext) {
		@apply text-slate-500 dark:text-gray-300;
	}
</style>
