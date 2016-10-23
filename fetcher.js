(function (global) {
    const fetchNext = Symbol();
    const withResolver = Symbol();
    const queue = Symbol();
    const count = Symbol();
    const pause = Symbol();
    const limit = Symbol();

    class Fetch {
        constructor(input, init, resolve, reject) {
            this.input = input;
            this.init = init;
            this.resolve = resolve;
            this.reject = reject;
        }
    }

    class Fetcher {
        constructor({ interval = 0, max = 1 } = {}) {
            this[queue] = [];
            this[count] = 0;
            this[pause] = interval;
            this[limit] = max;
        }

        [withResolver](resolver) {
            return response => {
                resolver(response);
                setTimeout(() => {
                    this[count]--;
                    this[fetchNext]();
                }, this[pause]);
                return response;
            };
        }

        [fetchNext]() {
            if (this[queue].length > 0 && this[count] < this[limit]) {
                const next = this[queue].shift();
                this[count]++;
                fetch(next.input, next.init).then(this[withResolver](next.resolve), this[withResolver](next.reject));
            }
        }

        /**
         * Same params and return value as https://developer.mozilla.org/en-US/docs/Web/API/GlobalFetch/fetch
         * @return Promise
         * */
        fetch(input, init) {
            const promise = new Promise((resolve, reject) => {
                this[queue].push(new Fetch(input, init, resolve, reject));
            });

            this[fetchNext]();

            return promise;
        }
    }

    global.Fetcher = Fetcher;
})(window);
