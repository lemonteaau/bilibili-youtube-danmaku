# B2Y - YouTube 同步显示 Bilibili 弹幕 (Firefox Fork)

> **Note:** This is a fork of the original [B2Y - YouTube 同步显示 Bilibili 弹幕](https://github.com/ahaduoduoduo/bilibili-youtube-danmaku) project, specifically adapted for **Mozilla Firefox**.
>
> 这个版本主要为了解决在 Firefox 浏览器上的兼容性问题，并进行了性能优化。

🍻关注的 UP 在 Youtube 和 B 站都有投稿，想在 Youtube 看更好的画质又想看弹幕🤔？

让 YouTube 视频也能拥有 B 站的弹幕氛围！
关联 B 站 UP 主或手动输入视频链接，同步弹幕到 YouTube 播放页面～

## ✅ 支持功能

- ✨ 自动查找并加载对应弹幕
- ✨ 支持时间轴偏移校准
- ✨ 支持调整弹幕字体大小、透明度、滚动速度、垂直间距
- ✨ 支持设置弹幕显示区域范围
- ✨ 支持智能弹幕过滤
- ✨ 支持弹幕搜索和跳转时间轴
- ✨ 支持 “哔哩哔哩动画” 频道内番剧正片自动获取弹幕

## 🧩 使用方法

0. 安装本插件
1. 打开你在 YouTube 上观看的对应视频
2.1 热门UP主可以自动匹配，无需设置
   2.2 手动输入可绑定 UP 主B 站空间（输入 https://space.bilibili.com/xxxx 格式的 UP 主空间链接）
      2.3 也可以手动输入 B 站原视频链接。
3. 弹幕将在播放时自动显示在视频上方
4. 可根据需要调节字体大小、透明度、轨道间距、滚动速度等显示参数

## ✨ 特色功能

- **自动匹配：** 公共匹配库存在数据，或手动绑定 UP 主后，播放该 YouTube 频道的任意视频时，会自动匹配并加载对应 B 站视频的弹幕，无需每次手动输入链接。（未匹配到的视频可以手动匹配）
- **实时更新：** 绑定 UP 主后，打开任意视频时，会更新最新弹幕内容。
- **番剧支持：** “哔哩哔哩动画Anime Made By Bilibili ” 频道下的番剧正片，可自动获取弹幕（无需配置）

🎉欢迎贡献UP主匹配信息🎉

## 📦 安装方式

### 🦊 Firefox 安装方式 (此 Fork)

1.  前往本 Fork 的 [Release 页面](https://github.com/lemonteaau/bilibili-youtube-danmaku/releases) 下载最新版本的 `zip` 文件。
2.  解压下载的 `zip` 文件到本地一个固定的文件夹。
3.  打开 Firefox 浏览器，在地址栏输入 `about:debugging` 并按回车。
4.  点击左侧的“此 Firefox”。
5.  点击“加载临时附加组件...”按钮。
6.  在文件选择框中，进入你刚刚解压的文件夹，选择 `manifest.json` 文件。
7.  安装完成！插件图标会出现在浏览器工具栏中。

### 🌐 Chrome 应用商店版本（原版）

[![Chrome Web Store](https://img.shields.io/chrome-web-store/v/dmkbhbnbpfijhgpnfahfioedledohfja.svg)](https://chromewebstore.google.com/detail/b2y-youtube-%E5%90%8C%E6%AD%A5%E6%98%BE%E7%A4%BA-bilibili/dmkbhbnbpfijhgpnfahfioedledohfja)

**[🚀 点击前往 Chrome 应用商店安装](https://chromewebstore.google.com/detail/b2y-youtube-%E5%90%8C%E6%AD%A5%E6%98%BE%E7%A4%BA-bilibili/dmkbhbnbpfijhgpnfahfioedledohfja)**

1. 打开上方链接
2. 点击"添加至 Chrome"按钮
3. 确认安装即可使用

### 🛠️ Chrome 手动安装（原版备选）

> 💡 **注意：** 优先推荐使用 Chrome 应用商店版本，仅在无法访问应用商店时才使用以下手动安装方式。
1. 前往原项目的 [Release 页面](https://github.com/ahaduoduoduo/bilibili-youtube-danmaku/releases) 下载最新版本的 zip 文件
2. 解压下载的 zip 文件到本地文件夹
3. 打开 Chrome 浏览器，进入扩展程序管理页面：
   - 方法一：在地址栏输入 `chrome://extensions/`
   - 方法二：点击浏览器右上角三点菜单 → 更多工具 → 扩展程序
4. 开启右上角的"开发者模式"开关
5. 点击"加载已解压的扩展程序"按钮
6. 选择刚才解压的插件文件夹
7. 安装完成！插件图标会出现在浏览器工具栏中

## 📝 更新日志

### 2025-08-04
1.0.9
- ✨ 优化了视频标题匹配模式
- ✨ 提供了公共匹配库

### 2025-08-04
1.0.8
- ✨ 添加多语言标题自动匹配功能（https://github.com/ahaduoduoduo/bilibili-youtube-danmaku/pull/1 ，感谢 @[lemonteaau](https://github.com/lemonteaau) ）

1.0.7
- ✨ 支持 “哔哩哔哩动画Anime Made By Bilibili ” 频道自动获取原创番剧弹幕

### 2025-08-04
1.0.6
- ✨ 优化了视频标题匹配模式
- ⚡ 提高了弹幕帧率

### [☕️支持我～](https://github.com/ahaduoduoduo/bilibili-youtube-danmaku/blob/main/DONATE.md)

