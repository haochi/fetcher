Fetcher
=======

Configurable throttled Fetch API

Usage
-------

### Instantiate a `Fetcher({ interval: number, max: number })` instance

* `interval`: interval between each fetch, in milliseconds
* `max`: number of `fetch`es to run in parallel

```javascript
const fetcher = new Fetcher({ interval: 1000, max: 1 });
```

### Use the `fetch` method as you would normally do with the `fetch` API.

```javascript
// These five calls will call sequentially since `max` is set to 1
["/", "/status/500", "/ip", "/", "/"].forEach(path => {
    fetcher.fetch(`https://httpbin.org/${path}`).then(() => console.log(path, 'loaded'));
});
```

Test
----

See `test/SpecRunner.html`
