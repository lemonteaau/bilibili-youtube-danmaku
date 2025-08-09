# B2Y - YouTube 同步显示 Bilibili 弹幕 - Firefox适配版

> 此版本为[原版插件](https://github.com/ahaduoduoduo/bilibili-youtube-danmaku)的 Firefox 适配版，原作者为 [ahaduoduoduo](https://github.com/ahaduoduoduo)，本项目由 [lemonteaau](https://github.com/lemonteaau) 维护。


## 📦 安装方式

1. 访问 Release 页面
2. 下载最新版本的 `B2Y-Firefox-v*.zip` 文件并解压到本地文件夹
3. 打开 Firefox 浏览器
4. 在地址栏输入 `about:debugging`
5. 点击左侧的 "此 Firefox"
6. 点击 "临时载入附加组件"
7. 选择解压后文件夹中的 `manifest.json` 文件
8. 扩展安装完成！

### 注意事项

- 此方式安装的扩展在浏览器重启后会被移除，需要重新安装
- 扩展功能完全正常，只是每次重启需要重新载入

## 🔧 Firefox 特定说明

### 兼容性特性
- 使用 `browser` API 命名空间（同时兼容 `chrome` 命名空间）
- 采用 background scripts 而非 service worker
- 统一的 browserAPI 兼容层，避免重复声明问题
- 完全符合 Firefox WebExtensions 标准
- 支持 Firefox 109+ 版本

## 🎉 贡献

欢迎提交 issue 和 PR！

## 📄 许可证

本项目遵循原项目的许可证条款。