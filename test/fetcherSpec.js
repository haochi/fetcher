describe('Fetcher', function() {
    describe('constructor', function() {
        it('should be loaded', function () {
            expect(window.Fetcher).toBeDefined();
            expect(window.Fetcher).toEqual(jasmine.any(Function));
        });

        it('should be constructable with no options', function () {
            const fetcher = new window.Fetcher();
            expect(fetcher).toEqual(jasmine.objectContaining({
                fetch: jasmine.any(Function)
            }));
        });
    });

    describe('fetch', function () {
        const url = '/magical-kingdom';
        const content = 'magic';
        const time = () => (new Date).getTime() / 1000;
        const count = 5;

        const fetchWithIntervalAndLimit = (interval, max) => {
            const fetcher = new window.Fetcher({ interval, max });
            const requests = Array(count).fill().map(() => fetcher.fetch(url));
            return Promise.all(requests);
        };

        beforeEach(function () {
            spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response(content)));
        });

        it('should fetch successfully through native fetch', function (done) {
            const fetcher = new window.Fetcher();
            fetcher.fetch(url, undefined).then(response => {
                return response.text();
            }).then(body => {
                expect(window.fetch).toHaveBeenCalledWith(url, undefined);
                expect(body).toBe(content);
                done();
            });
        });

        it('should fetch in succession with interval', function (done) {
            const startTime = time();
            const interval = 1000;
            const max = 1;

            fetchWithIntervalAndLimit(interval, max).then(() => {
                const endTime = time();
                const interval = (endTime - startTime) / max;
                expect((count / max - 1) < interval && interval < (count / max)).toBe(true);
                done();
            })
        });

        it('should fetch in succession with interval and max', function (done) {
            const startTime = time();
            const interval = 1000;
            const max = 2;

            fetchWithIntervalAndLimit(interval, max).then(() => {
                const endTime = time();
                const interval = (endTime - startTime);
                expect((count / max - 1) < interval && interval < (count / max)).toBe(true);
                done();
            })
        });
    });
});
