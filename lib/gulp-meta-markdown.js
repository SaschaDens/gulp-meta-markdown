var marked = require('marked'),
    through = require('through2'),
    gutil = require('gulp-util'),
    PluginError = gutil.PluginError;

function gulpMetaMarkdown(options) {
    'use strict';

    var _splitContent = function (content) {
            var metadata,
                pattern = /\n-{3}/g,
                output = {
                    meta: {},
                    content: ''
                };

            if (content.slice(0, 3) === '---') {
                metadata = pattern.exec(content);

                if (metadata) {
                    output.meta = _getMetaTags(content.slice(4, metadata.index));
                    output.content = marked(content.slice(pattern.lastIndex));
                }
            } else {
                output.content = marked(content);
            }

            return output;
        },

        _getMetaTags = function (metadata) {
            var result = {},
                itemArr;

            metadata.split('\n').forEach(function (item) {
                itemArr = item.split(': ');
                if (itemArr[0] && itemArr[1]) {
                    result[itemArr[0]] = itemArr[1].trim();
                }
            });

            return result;
        },
        
        _modifyStream = function () {
            var rendered,
                buffer;

            return through.obj(function (chunk, enc, callback) {
                if (chunk.isNull()) {
                    return callback(null, chunk);
                }

                if (chunk.isStream()) {
                    return callback(new PluginError('gulp-meta-markdown', 'Streaming not supported'));
                }

                rendered = JSON.stringify(_splitContent(chunk.contents.toString()));
                chunk.contents = new Buffer(rendered);
                chunk.path = gutil.replaceExtension(chunk.path, '.json');

                this.push(chunk);
                callback();
            });
        };

    return _modifyStream();
}

gulpMetaMarkdown.marked = marked;

module.exports = gulpMetaMarkdown;
