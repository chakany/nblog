# nblog
nostr-based ghost blog
See a running demo at https://blog.jacany.com

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fjacany%2Fnblog&env=PUBLIC_PUBKEYS,PUBLIC_RELAYS,PUBLIC_NAME,PUBLIC_PICTURE&envDescription=nblog%20configuration&envLink=https%3A%2F%2Fgithub.com%2Fjacany%2Fnblog%23configuration&project-name=nblog&repository-name=my-nblog)

## Configuration
Configuration is done with enviroment variables.
* `PUBLIC_PUBKEYS` List of pubkeys to fetch events for seperated by a `,`
* `PUBLIC_RELAYS` List of relay URLs to connect to seperated by a `,`
* `PUBLIC_NAME` A name for your blog. ex: `nym's blog`
* `PUBLIC_PICTURE` A Picture URL for your blog, used in favicon and header.
