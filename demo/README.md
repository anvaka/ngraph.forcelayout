# ngraph.forcelayout demo

This folder contains a demo of the `ngraph.forcelayout` package.

If you drop any `.dot` file into the browser window the demo will attempt to visualize it.


### Compiles and hot-reloads for development

```
npm start
```

This should render a simple graph and you can do some basic layout. You can drop `.dot` files into it
to load new graphs.

### Compiles and minifies for production

```
npm run build
```

### Deploy

The demo always bundles the library from the same commit (see `vite.config.js`).

* Every push to `main` publishes it to https://anvaka.github.io/ngraph.forcelayout/
  (`.github/workflows/deploy.yml`).
* Every pull request gets a preview at
  `https://anvaka.github.io/ngraph.forcelayout/pr-preview/pr-<number>/`, linked in a PR comment
  and removed when the PR closes (`.github/workflows/preview.yml`).

## What's inside?

* [ngraph.graph](https://github.com/anvaka/ngraph.graph) as a graph data structure
* [ngraph.forcelayout](https://github.com/anvaka/ngraph.forcelayout) for the basic graph layout
* Add-ons from [modules](../modules), shown in the "Add-ons" section: pivot start and a WebGPU
  layout. They are not part of ngraph.forcelayout.
* [w-gl](https://github.com/anvaka/w-gl) - super duper obscure (and fast) WebGL renderer.
* vue.js powered UI and dev tools.

## Thanks!

* Stay tuned for updates: https://twitter.com/anvaka
* If you like my work and would like to support it - https://www.patreon.com/anvaka