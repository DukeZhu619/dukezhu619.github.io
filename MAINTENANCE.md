# 博客维护

网站：https://dukezhu619.github.io

## 日常发布

继续使用思源「发布工具」的 GitHub / Hexo 配置，文章目录仍为 `source/_posts`，分支为 `main`。主题迁移不改变文章的 `permalink`，也不要求额外填写 `math` 字段。

域名与仓库更名后，插件中的仓库应为 `DukeZhu619/dukezhu619.github.io`，网站地址应为 `https://dukezhu619.github.io`。本次尚未从思源客户端实际发布；下一次可更新一篇已有笔记，确认自动构建和链接正常。

文章分类和标签继续使用原来的写法。学习笔记以文字列表展示；日后旅行文章可以设置 `cover` 图片，并在正文插入照片。About 内容位于 `source/about/index.md`。

## 外观和公式

- Butterfly 版本锁定为 5.7.0，配置在 `_config.butterfly.yml`。
- 自定义样式在 `source/css/duke.css`，不直接修改主题包。
- 数学由 `@traptitech/markdown-it-katex` 构建时渲染，字体和样式随网站发布。
- `scripts/site-assets.js` 负责公式资源和外部服务配置。
- 页脚仅显示“已航行”的动态时长。计时起点在 `_config.butterfly.yml` 的 `footer.launch_at`，暂采用仓库最早保留的提交时间 `2025-03-16T14:40:40+08:00`，不代表已核实的首次建站时间；`source/js/site-journey.js` 每秒更新显示。

## 评论与访客地图

访客地球使用用户提供的 MapMyVisitors 代码，公开站点标识已写入配置。该服务根据访问网络估计地理位置，从启用后开始积累数据。

评论当前关闭。准备好 Twikoo 后，在 `_config.butterfly.yml` 的 `twikoo.envId` 填入 HTTPS 服务地址即可自动启用；也可通过构建环境变量 `TWIKOO_ENV_ID` 提供。完成部署后再验证访客留言、站长回复和通知。不要把管理密码写入仓库。

## 检查与发布

使用 Node.js 22，依次运行 `npm ci`、`npm run clean`、`npm run build`、`npm run verify`。推送 `main` 后，GitHub Actions 自动检查并发布 GitHub Pages。

迁移提交之前的版本为 `5f874c79f1688d998f26d8446fdb59dcd9eb0168`。需要回退时回滚迁移提交即可；不要用强制推送覆盖随后由思源发布的文章。
