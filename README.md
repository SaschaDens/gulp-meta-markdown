# gulp-meta-markdown

With this plugin it's possible to add additional meta data to the markdown files and will parse this to a JSON format.
The markdown is compiled with [marked](https://github.com/chjj/marked) and also exposes the same API

## Example

Here is an example of a markdown file containing metadata.
The metadata is listed between `---` tags. You can add any custom tag.
```
---
title: Git meta markdown
slug: git-meta-markdown
---
# Git meta markdown
lorum ipsum
```
When the md file is compiled it will return the file in the following JSON format
```javascript
{
  "meta": {
    "title": "Git meta markdown",
    "slug": "git-meta-markdown"
  },
  "content": "<h1 id=\"git-meta-markdown\">Git meta markdown</h1><p>lorum ipsum</p>"
}
```
Gulpfile.js will contain the following.
```javascript
var gulp = require('gulp'),
    metaMarkdown = require('./lib/gulp-meta-markdown');

gulp.task('articles', function () {
    // API can be found at https://github.com/chjj/marked
    metaMarkdown.marked.setOptions({
        gfm: true,
        breaks: false
    });

    return gulp
        .src('./articles/*.md')
        .pipe(metaMarkdown())
        .pipe(gulp.dest('./articles'));
});
```
## TODO
- AngularJS integration example for static pages
