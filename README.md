# nblog

nostr-based ghost blog
See a running demo at https://hello-nblog.vercel.app

## Setup

### Vercel (Quick and Easy)

Simply click this bright, blue button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/jacany/nblog/tree/master&env=PUBLIC_PUBKEYS,PUBLIC_RELAYS,PUBLIC_NAME,PUBLIC_PICTURE,PUBLIC_REACTIONS&envDescription=nblog%20configuration&envLink=https://github.com/jacany/nblog%23configuration&project-name=nblog&repository-name=my-nblog)

### Locally

Ensure you have Node.js installed on your computer.

1. [Fork this repository](https://github.com/jacany/nblog/fork)
2. Git clone you new fork to your server
3. Inside the project root, run `git checkout master` to switch to the master branch for the most stable version
4. Add a `.env` file to the project root. See the Configuration section
5. Run `yarn` to install node packages
6. Run `yarn build` to build the production server
7. Run `yarn preview` to run the sever.

If you did it right, that's about it!

## Configuration

Configuration is done with enviroment variables.

-   `PUBLIC_PUBKEYS` List of **HEX** pubkeys to fetch events for seperated by a `,`
-   `PUBLIC_RELAYS` List of relay URLs to connect to seperated by a `,`.
    -   It's best to keep this list as small as possible. Less relays = faster blog and less room for errors (updates not being published)
-   `PUBLIC_NAME` A name for your blog. ex: `nym's blog`
-   `PUBLIC_PICTURE` A Picture URL for your blog, used in favicon and header.
-   `PUBLIC_REACTIONS` Controls if you want reactions underneath your posts. Can either be `true` or `false`.

## Customization

#### Accent Color
If you want to change the accent color, simply open `src/app.css` and look for the `--accent-color` variable.
```css
:root {
	--accent-color: #ea5a0c;
}
```
This variable will control the accent color, here you can set a hex value, or RGB, or something else.
Accent color can be applied to elements using tailwind with it's color classes. For changing text color it would be `text-accent`, background is `bg-accent` and so on.

#### Individual Pages
nblog uses [SvelteKit](https://kit.svelte.dev/). SvelteKit pages use directory based routing, and these files can be found in `src/routes` and are addressed by `+page.svelte` or `+layout.svelte`.
For example, if you wanted to change the header or footer, those could be found in `src/routes/+layout.svelte`.
If you wanted to add info to the home page, you can edit it in `src/routes/+page.svelte`
Keep in mind that nblog uses [Tailwind CSS](https://tailwindcss.com) for styling, so there are built in classes for you to use at your disposal.

#### Components
Various components are used throughout the app and can be customized. They are all located in `src/lib/*.svelte`.


## Credits
- Karnage for giving constructive critisism of the original design, providing his own designs, and making [v0.4.0](https://github.com/jacany/nblog/releases/tag/v0.4.0) possible.
	- npub1r0rs5q2gk0e3dk3nlc7gnu378ec6cnlenqp8a3cjhyzu6f8k5sgs4sq9ac
