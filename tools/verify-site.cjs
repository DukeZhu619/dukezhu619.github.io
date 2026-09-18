'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const frontMatter = require('hexo-front-matter');
const yaml = require('js-yaml');
const { unescapeHTML } = require('hexo-util');

const root = path.resolve(__dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const exists = file => fs.existsSync(path.join(root, file));
const config = yaml.load(read('_config.yml'));
const theme = yaml.load(read('_config.butterfly.yml'));
assert.equal(config.theme, 'butterfly');
assert.equal(config.url, 'https://dukezhu619.github.io');
assert.ok(!exists('public/CNAME'), 'A custom domain must not be regenerated.');

for (const route of ['index.html', 'about/index.html', 'archives/index.html', 'categories/index.html', 'tags/index.html', 'search.xml', 'css/duke.css']) {
  assert.ok(exists(`public/${route}`), `Missing route: ${route}`);
}
const files = fs.readdirSync(path.join(root, 'source/_posts'), { recursive: true })
  .filter(file => file.endsWith('.md'));
assert.ok(files.length > 0, 'No posts found.');
let mathPosts = 0;
for (const file of files) {
  const post = frontMatter.parse(read(`source/_posts/${file}`));
  assert.ok(post.permalink, `Missing stable permalink: ${file}`);
  const output = `public/${post.permalink.replace(/^\//, '')}`;
  assert.ok(exists(output), `Missing published post: ${post.permalink}`);
  const html = read(output);
  assert.ok(html.includes('id="article-container"'), `Missing article body: ${file}`);
  assert.ok(!html.includes('class="katex-error"'), `Invalid formula in ${file}`);
  if (html.includes('class="katex"')) {
    mathPosts++;
    assert.ok(html.includes('/vendor/katex/katex.min.css'), `Missing formula styles: ${file}`);
  }
}
assert.ok(mathPosts > 0, 'No rendered formulas found.');
for (const asset of ['katex.min.css', 'fonts/KaTeX_Main-Regular.woff2', 'fonts/KaTeX_Math-Italic.woff2']) {
  assert.ok(exists(`public/vendor/katex/${asset}`), `Missing local formula asset: ${asset}`);
}
const home = read('public/index.html');
if (theme.visitor_map.script_url) {
  assert.equal((home.match(/id="mmvst_globe"/g) || []).length, 1, 'Expected one visitor globe.');
  assert.ok(unescapeHTML(home).includes(theme.visitor_map.script_url), 'Missing visitor map URL.');
}
if (!theme.twikoo.envId && !process.env.TWIKOO_ENV_ID) {
  assert.ok(!home.includes('twikoo.init('), 'Comments must stay disabled without a service.');
}
console.log(`Verified ${files.length} stable article URLs, ${mathPosts} articles with formulas, navigation pages, search, local math assets and visitor embed.`);
