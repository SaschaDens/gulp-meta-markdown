var assert = require('assert'),
    File = require('vinyl'),
    metaMarkdown = require('../lib/gulp-meta-markdown'),
    metaMark;

describe('gulp-meta-markdown', function() {

    beforeEach(function () {
        metaMark = metaMarkdown();
    });

    describe('in buffer mode', function () {

        it('should return object with meta and content property', function (done) {
            var fakeFile = new File({
                path: 'fakefile.md',
                contents: new Buffer('# Testing with mocha\nluckly this works')
            });

            metaMark.write(fakeFile);
            metaMark.once('data', function (file) {
                var response = JSON.parse(file.contents.toString());
                assert.ok(response.hasOwnProperty('meta'));
                assert.ok(response.hasOwnProperty('content'));
                done();
            });
        });

        it('should return parsed markdown', function (done) {
            var fakeFile = new File({
                    path: 'fakefile.md',
                    contents: new Buffer('# Testing with mocha\nluckly this works')
                });

            metaMark.write(fakeFile);
            metaMark.once('data', function (file) {
                assert.equal(fakeFile.contents.toString(), '{"meta":{},"content":"<h1 id=\\"testing-with-mocha\\">Testing with mocha</h1>\\n<p>luckly this works</p>\\n"}');

                done();
            });
        });
        
        it('should change md extension to json extension', function (done) {
            var fakeFile = new File({
                path: 'fakefile.md',
                contents: new Buffer('extension test')
            });

            metaMark.write(fakeFile);
            metaMark.once('data', function (file) {
                assert.equal(file.path, 'fakefile.json');
                done();
            });
        });

        it('should return empty meta object when no tags are used', function (done) {
            var fakeFile = new File({
                path: 'fakefile.md',
                contents: new Buffer('# mocha moca\ntesting')
            });

            metaMark.write(fakeFile);
            metaMark.once('data', function (file) {
                assert.equal(fakeFile.contents.toString(), '{"meta":{},"content":"<h1 id=\\"mocha-moca\\">mocha moca</h1>\\n<p>testing</p>\\n"}');
                done();
            });
        });

        it('should return filled meta object when tags are used', function (done) {
            var fakeFile = new File({
                path: 'fakefile.md',
                contents: new Buffer('---\ntitle: Mocha art\nslug: mocha-art\n---\n# mocha moca\ntesting')
            });

            metaMark.write(fakeFile);
            metaMark.once('data', function (file) {
                var response = JSON.parse(file.contents.toString());

                assert.equal(response.meta.title, 'Mocha art');
                assert.equal(response.meta.slug, 'mocha-art');
                done();
            });
        });
    });
});