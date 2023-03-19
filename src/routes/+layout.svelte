<script lang="ts">
    import "../app.css";
    import "@fontsource/noto-serif-lao";
    import { PUBLIC_NAME, PUBLIC_PICTURE } from "$env/static/public";
</script>

<svelte:head>
    <title>{PUBLIC_NAME}</title>
    <link rel="icon" type="image/x-icon" href={PUBLIC_PICTURE} />
</svelte:head>

<nav class="flex mx-20 my-10">
    <a href="/" target="_self" class="flex my-auto">
        <img class="rounded my-auto w-14" src={PUBLIC_PICTURE} />
        <span class="my-auto ml-2">{PUBLIC_NAME}</span>
    </a>
    <div class="flex my-auto ml-10">
        <ul>
            <li><a class="underline" href="/posts" target="_self">Posts</a></li>
        </ul>
    </div>
</nav>

<div class="container">
    <slot></slot>
</div>

<footer class="mt-20">
    This website is published under the <a class="underline" href="https://github.com/jacany/nblog/tree/master/LICENSE">MIT License</a>
</footer>

<style lang="postcss">
    :global(html,body) {
        font-family: "Noto Serif Lao", serif;
        @apply dark:text-white dark:bg-black
    }

    :global(.subtext) {
        @apply text-slate-500 dark:text-gray-300;
    }
</style>