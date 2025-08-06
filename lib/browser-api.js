/**
 * 跨浏览器 API 兼容性层
 * 提供统一的 API 接口，支持 Firefox 的 browser 命名空间和 Chrome 的 chrome 命名空间
 */

// 全局 browserAPI 变量，避免重复声明
if (typeof window !== 'undefined') {
    // 在 content script 或 popup 中
    window.browserAPI = typeof browser !== 'undefined' ? browser : chrome;
} else {
    // 在 background script 中
    globalThis.browserAPI = typeof browser !== 'undefined' ? browser : chrome;
}