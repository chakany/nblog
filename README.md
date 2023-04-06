# nblog

nostr-based ghost blog
See a running demo at https://blog.jacany.com

## Setup

### Vercel (Quick and Easy)

Simply click this bright, blue button:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjacany%2Fnblog&env=PUBLIC_PUBKEYS,PUBLIC_RELAYS,PUBLIC_NAME,PUBLIC_PICTURE,PUBLIC_REACTIONS&envDescription=nblog%20configuration&envLink=https%3A%2F%2Fgithub.com%2Fjacany%2Fnblog%23configuration&project-name=nblog&repository-name=my-nblog)

### Locally

Ensure you have Node.js installed on your computer.

1. [Fork this repository](https://github.com/jacany/nblog/fork)
2. Git clone you new fork to your server
3. Add a `.env` file to the project root. See the Configuration section
4. Run `yarn` to install node packages
5. Run `yarn build` to build the production server
6. Run `yarn preview` to run the sever.

If you did it right, that's about it!

## Configuration

Configuration is done with enviroment variables.

-   `PUBLIC_PUBKEYS` List of **HEX** pubkeys to fetch events for seperated by a `,`
-   `PUBLIC_RELAYS` List of relay URLs to connect to seperated by a `,`
-   `PUBLIC_NAME` A name for your blog. ex: `nym's blog`
-   `PUBLIC_PICTURE` A Picture URL for your blog, used in favicon and header.
-   `PUBLIC_REACTIONS` Controls if you want reactions underneath your posts. Can either be `true` or `false`.
