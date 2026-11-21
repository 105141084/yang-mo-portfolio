# 杨莫作品集

当前版本是一版可本地预览的交互作品集原型，主要参考以下三个站点：

- [moenamer.com](https://moenamer.com)：运营岗位叙事、个人定位、过程与案例组织。
- [codrops/atelier-north](https://github.com/codrops/atelier-north)：超大编辑式标题、网格、像素揭示和滚动节奏。
- [codrops/UnrevealEffects](https://github.com/codrops/UnrevealEffects)：使用遮罩预览和 `clip-path` 组织内容切换。

页面没有复制参考站的品牌、文案或素材，只提炼并重组结构与交互原则。

## 本地预览

双击 `启动预览.cmd`，会自动在浏览器打开：

```text
http://127.0.0.1:4174
```

也可以在当前目录运行：

```powershell
node server.js
```

## GitHub Pages 部署

网站本身是纯静态页面，可以直接通过 GitHub Pages 发布。`server.js` 仅用于本地预览，不参与线上部署。

首次发布时，在仓库的 `Settings → Pages → Build and deployment` 中将 `Source` 设置为 `GitHub Actions`。之后每次推送 `main` 分支，工作流都会自动生成发布包并部署。

本地构建发布包：

```powershell
npm run build:static
```

工作流默认使用以下地址格式：

```text
https://<GitHub用户名>.github.io/<仓库名>/
```

当前线上地址：

```text
https://105141084.github.io/yang-mo-portfolio/
```

更新网站时，修改源文件后提交并推送：

```powershell
git add .
git commit -m "更新作品集"
git push
```

GitHub Actions 完成后，刷新线上网址即可看到更新；通常需要等待约 1–10 分钟。

## 文件

- `index.html`：页面内容与语义结构。
- `styles.css`：视觉系统、响应式布局和动效降级。
- `script.js`：GSAP 首屏、滚动叙事、遮罩预览和交互。
- `assets/`：从真实作品集中整理并重新裁切的图片，以及网页版视频片段。
- `assets/posters/`：独立整理的海报、品牌创意广告与摄影拼贴作品。
- `vendor/`：本地 GSAP、ScrollTrigger 和 Lenis，离线预览不依赖 CDN。

## 内容边界

- AI 短片已明确标注为个人品牌概念练习，不代表品牌授权。
- 企业文化案例只使用可核验的职责与产出，不虚构阅读量、参与率或留存数据。
- 当前版本只公开邮箱 `ymworkwork@qq.com` 和微信 `Ym19326405794`；不公开电话、个人照片及其他联系方式。
- 旧作品集和企业内部截图没有作为原始整页直接展示，必要素材已重新裁切。

## 下一轮需要补强

1. 为三个案例补充真实过程证据：选题表、分镜、迭代对比、发布截图或复盘记录。
2. 将 AI 视频再剪为 20 秒竖屏版本。
3. 完成桌面、手机、无动效和键盘操作验收。
4. 根据目标公司准备内容运营版单页简历。
