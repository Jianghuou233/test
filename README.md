# Sion (シオン / 诗音) ✦ eden* 纪念站

一座献给诗音、天门与 minori 的非官方沉浸式同人纪念站。

> They were only two, on the planet.
>
> 名为「地球」的星球上，最后的恋爱物语。

站点名称与主标题：**Sion (シオン / 诗音) ✦ eden* 纪念站**

## 直接打开 / GitHub Pages 部署

这是纯静态站点，**没有构建步骤，也不需要 npm**。三个核心文件直接放在仓库根目录即可：

```text
/
├─ index.html
├─ style.css
├─ script.js
├─ images/
│  ├─ album_cover.webp
│  ├─ avatar.webp
│  └─ cg/…
├─ audio/…
├─ .nojekyll
└─ README.md
```

本地体验：

- 直接双击 `index.html` 即可；
- 或启动任意静态服务器，例如 `python -m http.server 4173`，访问 `http://127.0.0.1:4173/`。

GitHub Pages：

1. 将整个目录推送到 GitHub 仓库。
2. 仓库 **Settings → Pages → Build and deployment**。
3. Source 选择 **Deploy from a branch**，Branch 选择 `main`，目录选择 `/ (root)`，保存。
4. 等待 GitHub Actions/Pages 发布完成，访问生成的 URL。

所有路径均为相对路径（`./images/…`、`./audio/…`），因此无论部署在用户主页根路径还是 `/<repo-name>/` 项目子路径，都可以直接工作。`.nojekyll` 用于跳过 Jekyll 处理。

> 素材体积提示：当前 `audio/` 约 137 MB、图片约 9 MB。GitHub Pages 单文件限制为 100 MB、站点体量上限约 1 GB；现有文件均满足限制，但首次部署和载入可能需要一点耐心。播放器只会按需加载当前曲目。

## 素材映射

全部媒体路径集中在 `script.js` 顶部的 `SITE_CONFIG`。如果你的素材目录名称不同，只需要改 `paths`：

```js
const SITE_CONFIG = {
  paths: {
    images: "./images/",
    audio: "./audio/"
  },
  assets: { /* 语义化图片路径 */ },
  tracks: [ /* 37 首曲目 */ ],
  audio: { initial: "Sion.mp3", volume: 0.62, loop: "all" }
};
```

- 图片：修改 `paths.images`，或在 `assets` 里替换单张图；HTML 通过 `data-asset="summer.garden"` 这样的语义键取得图片。
- 音乐：修改 `paths.audio`，或编辑 `tracks` 中的 `file` 与显示 `title`。示例格式：

```js
tracks: [
  { title: "Sion", file: "Sion.mp3" },
  { title: "Eternal sleep", file: "Eternal_sleep.mp3" }
]
```

- `audio.initial` 是首屏「听见诗音」按钮播放的曲目。播放器默认会把 `Sion` 放在档案第 01 位，其余曲目按现有目录顺序排列。
- 使用 `.webp` 图片能获得更快的加载速度；你也可以直接换成同名的 `.jpg` / `.png`，只要同步修改路径。

## 体验节点

- **序 / The Last Sky**：全屏人物记忆窗、双语标题、环境星野。
- **01 白い部屋 / Room 703**：档案卡、碎片影像、冰霜色相。
- **Thaw**：随滚动「融化」磨砂玻璃，露出奔向光明的两人。
- **02 夜明け**：破晓特写、光片与 RUN 流动字。
- **03 小さな夏**：非对称 Bento Grid 夏日碎片。
- **04 風の野**：山丘蒲公英原野，可主动「起风」。
- **05 終幕**：可亲手推进的视觉小说对白（34 句原作文本，逐句推进）、打字机文字、自动播放、重播。
- **06 星の音**：33⅓ 黑胶原声圣所，37 首天门 OST；支持播放/暂停、上一首/下一首、进度拖拽、音量、静音、列表/单曲/关闭循环。
- **尾聲**：点亮一颗星，向 minori 道一声谢谢。

## 技术与无障碍

- 原生 HTML5 + CSS3 + ES2020，零第三方依赖、零构建。
- 双 Canvas：背景星野 + 前景蒲公英光尘；DPR 上限 2，页面隐藏时暂停。
- 天空色相随章节切换；支持桌面章节轨道与移动端可点击章节点。
- 支持键盘、Skip Link、原生对话框焦点管理、可见焦点环与 `aria-live`。
- 全面支持 `prefers-reduced-motion`：关闭光尘、视差、打字机、自动推进等动态效果，但保留全部内容与功能。
- 音频不会自动播放；仅在用户点击后开始。

## 设计理念

站点被构想为一座「环行于熄灭地球上方」的记忆天文台。页面不是若干板块的堆叠，而是一次连续的电影式下坠：冷色的 703、被融化的门、盛夏山丘、蒲公英风野、最后的夕阳，以及散场后的星空与黑胶。

界面始终维持两种力的张力：

- **冷档案**：编号、等宽字、1px 细线、坐标、玻璃面板，像被留下的观测记录；
- **暖记忆**：Garamond 的余白、香槟金微光、迟暮的粉玫瑰、被风带走的蒲公英，像她终于拥有的那个夏天。

天空替整页承担叙事：破晓、正午、黄金时刻、暮色与星夜并非背景装饰，而是章节切换时观众所看见的「同一片天」。

*This is an unofficial, non-commercial fan tribute. `eden*`, its characters, CG artwork, soundtrack and dialogue belong to minori and their respective rights holders. The finale lines are quoted from the original final scene (Chinese translation) for memorial purposes.*
