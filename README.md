# B2Y - YouTube 同步显示 Bilibili 弹幕 - Firefox适配版

> 此版本为[原版插件](https://github.com/ahaduoduoduo/bilibili-youtube-danmaku)的 Firefox 适配版，原作者为 [ahaduoduoduo](https://github.com/ahaduoduoduo)，本项目由 [lemonteaau](https://github.com/lemonteaau) 维护。


## 📦 安装方式

#### 方法一：开发者模式安装

1. 在 Firefox 中打开 `about:config`
2. 搜索 `xpinstall.signatures.required`
3. 将值设置为 `false`（注意：这会降低安全性）
4. 重启 Firefox
5. 现在可以安装未签名的扩展

#### 方法二：临时安装（开发测试）

1. 打开 Firefox 浏览器
2. 在地址栏输入 `about:debugging`
3. 点击左侧的 "此 Firefox"
4. 点击 "临时载入附加组件"
5. 选择扩展文件夹中的 `manifest.json` 文件
6. 扩展将被临时安装（重启浏览器后会消失）

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