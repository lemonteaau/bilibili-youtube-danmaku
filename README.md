# B2Y - YouTube 同步显示 Bilibili 弹幕 - WXT多浏览器版

> 此版本为[原版插件](https://github.com/ahaduoduoduo/bilibili-youtube-danmaku)的 WXT 框架迁移版，原作者为 [ahaduoduoduo](https://github.com/ahaduoduoduo)，本项目由 [lemonteaau](https://github.com/lemonteaau) 维护。

## 📦 安装方式

### Chrome 浏览器

1. 访问 [Release 页面](../../releases)
2. 下载最新版本的 `bilibili-youtube-danmaku-v*-chrome.zip` 文件
3. 解压到本地文件夹
4. 打开 Chrome 扩展管理页面 (`chrome://extensions/`)
5. 开启右上角的"开发者模式"
6. 点击"加载已解压的扩展程序"，选择解压后的文件夹
7. 扩展安装完成！

### Firefox 浏览器

1. 访问 [Release 页面](../../releases)
2. 下载最新版本的 `bilibili-youtube-danmaku-v*-firefox.zip` 文件
3. 打开 Firefox 浏览器
4. 在地址栏输入 `about:debugging`
5. 点击左侧的"此 Firefox"
6. 点击"临时载入附加组件"
7. 选择下载的 zip 文件
8. 扩展安装完成！

### Edge 浏览器

1. 访问 [Release 页面](../../releases)
2. 下载最新版本的 `bilibili-youtube-danmaku-v*-edge.zip` 文件
3. 解压到本地文件夹
4. 打开 Edge 扩展管理页面 (`edge://extensions/`)
5. 开启"开发人员模式"
6. 点击"加载解压缩的扩展"，选择解压后的文件夹

### Safari 浏览器

1. 访问 [Release 页面](../../releases)
2. 下载最新版本的 `bilibili-youtube-danmaku-v*-safari.zip` 文件
3. 按照 Safari 扩展安装流程进行安装

## 🔧 使用说明

1. 安装扩展后，访问任意 YouTube 视频页面
2. 扩展会自动尝试匹配对应的 Bilibili 视频
3. 如果找到匹配视频，弹幕将自动显示在 YouTube 播放器上
4. 可以通过扩展图标打开设置面板进行个性化配置

## 🛠️ 开发说明

### 环境要求

- Node.js 18+
- npm 或 pnpm

### 开发环境搭建

```bash
# 克隆仓库
git clone https://github.com/lemonteaau/bilibili-youtube-danmaku.git
cd bilibili-youtube-danmaku

# 安装依赖
npm install

# 启动开发服务器（Chrome）
npm run dev

# 启动开发服务器（Firefox）
npm run dev:firefox
```

### 构建命令

```bash
# 构建所有浏览器版本
npm run build:all

# 单独构建
npm run build:chrome    # Chrome 版本
npm run build:firefox   # Firefox 版本
npm run build:edge      # Edge 版本
npm run build:safari    # Safari 版本

# 打包发布版本
npm run zip:all         # 打包所有版本
npm run zip:chrome      # 打包 Chrome 版本
npm run zip:firefox     # 打包 Firefox 版本
```

## 📋 注意事项

### Firefox 临时安装
- Firefox 通过 `about:debugging` 安装的扩展在浏览器重启后会被移除
- 需要重新安装或使用签名版本（需要 Mozilla 审核）
- 扩展功能完全正常，只是需要重新载入

### Chrome 开发者模式
- 需要开启开发者模式才能安装未发布的扩展
- 可能会显示"来自未知开发者"的警告，属于正常现象

### 版本更新
- 手动安装的扩展不会自动更新
- 需要定期检查 Release 页面获取最新版本

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

### 贡献指南
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 📄 许可证

本项目基于 MIT 许可证开源 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- 感谢 [ahaduoduoduo](https://github.com/ahaduoduoduo) 创建了原版插件
- 感谢 [WXT 框架](https://wxt.dev/) 提供的优秀开发体验
- 感谢 [Danmaku](https://github.com/weizhenye/Danmaku) 提供的弹幕引擎
- 感谢所有贡献者的支持和反馈
