'use strict';

const frontMatter = require('hexo-front-matter');
const { stripHTML, unescapeHTML, escapeHTML, truncate } = require('hexo-util');

const coverRules = [
  ['quantization', /量化|quantiz|\bQAT\b|\bPTQ\b/i],
  ['optimization', /优化|optim|zeroth|梯度|随机逼近/i],
  ['networks', /神经|深度学习|强化学习|世界模型|训练|world model|transformer|attention|\b(?:CNN|RNN|LSTM|GAN|LLM)\b/i],
  ['algorithms', /算法|数据结构|二叉|链表|排序|leetcode|algorithm/i],
  ['data', /数据|统计|概率|回归|聚类|预测|机器学习|machine learning|data|statistic/i]
];
const chooseCover = text => coverRules.find(([, pattern]) => pattern.test(text))?.[0];
const plainText = html => unescapeHTML(stripHTML(html)).replace(/\s+/g, ' ').trim();
const titleKey = text => plainText(text).replace(/[\p{P}\p{Z}\s]/gu, '').toLowerCase();

// Run after Hexo renders posts (priority 10), before Butterfly's generators.
hexo.extend.filter.register('before_generate', function () {
  if (this.config.theme !== 'butterfly') return;
  const length = this.theme.config.index_post_content.length;
  return Promise.all(this.locals.get('posts').map(post => {
    // Read original front matter so cached theme defaults never override author choices.
    const meta = frontMatter.parse(post.raw);
    if (meta.cover === undefined || meta.cover === null || meta.cover === '') {
      const topic = chooseCover(post.title) || chooseCover(JSON.stringify([meta.tags, meta.categories])) || 'notes';
      post.cover = `/images/covers/${topic}.jpg`;
      // Automatic thumbnails should not create a large banner above the article.
      post.top_img = meta.top_img === undefined ? false : meta.top_img;
    } else {
      post.cover = meta.cover;
    }

    post.postDesc = undefined;
    if (!post.encrypt && !post.description && this.theme.config.index_post_content.method === 2) {
      const body = (post.content || '').replace(/^\s*<h([1-6])\b[^>]*>([\s\S]*?)<\/h\1>/i,
        (heading, _level, text) => titleKey(text) === titleKey(post.title) ? '' : heading);
      // Only the list summary changes; the published article body stays intact.
      post.postDesc = escapeHTML(truncate(plainText(body.replace(/<\/(?:p|div|h[1-6]|li)>/gi, ' ')), { length }));
    }
    // Generators query fresh records, so retain these fields in Hexo's build cache.
    return post.save();
  }));
}, 30);
