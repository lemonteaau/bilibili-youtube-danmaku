import Danmaku from 'danmaku/dist/esm/danmaku.dom.js';

class DanmakuEngine {
    constructor(container) {
        this.container = container;
        this.danmaku = null;
        this.settings = {
            enabled: true,
            timeOffset: 0,
            opacity: 100,
            fontSize: 24,
            speed: 1.0,
            displayAreaPercentage: 100,
            weightThreshold: 0
        };
        this.video = document.querySelector('video');
        this.originalDanmakus = [];
        this.init();
    }

    init() {
        this.container.style.setProperty('--danmaku-font-size', `${this.settings.fontSize}px`);
        this.container.style.setProperty('--danmaku-opacity', this.settings.opacity / 100);

        this.danmaku = new Danmaku({
            container: this.container,
            media: this.video,
            engine: 'dom'
        });

        this.observeResize();
    }

    observeResize() {
        if (window.ResizeObserver) {
            this.resizeObserver = new ResizeObserver(() => {
                this.danmaku.resize();
            });
            this.resizeObserver.observe(this.container);

            if (this.video) {
                this.resizeObserver.observe(this.video);
            }
        }

        document.addEventListener('fullscreenchange', () => this.danmaku.resize());
        document.addEventListener('webkitfullscreenchange', () => this.danmaku.resize());
    }

    loadDanmakus(danmakus) {
        this.originalDanmakus = danmakus;
        if (!this.danmaku) return;

        if (this.danmaku) {
            this.danmaku.destroy();
        }

        const comments = danmakus
            .filter((d) => {
                const weight = d.weight !== undefined && d.weight !== null ? d.weight : 5;
                return weight >= this.settings.weightThreshold;
            })
            .map((d) => {
                const finalFontSize = d.fontSize || this.settings.fontSize;
                return {
                    text: d.text,
                    time: d.time + this.settings.timeOffset,
                    mode: d.mode || 'rtl', // 添加弹幕模式支持：rtl, ltr, top, bottom
                    style: {
                        color: d.color || '#ffffff',
                        fontSize: `${finalFontSize}px`, // 优先使用原始字体大小，否则使用设置的字体大小
                        fontFamily: "SimHei, 'Microsoft YaHei', Arial, sans-serif",
                        fontWeight: 'bold',
                        textShadow:
                            '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 2px #000'
                    }
                };
            });

        // 设置CSS变量来控制字体大小
        this.container.style.setProperty('--danmaku-font-size', `${this.settings.fontSize}px`);

        this.danmaku = new Danmaku({
            container: this.container,
            media: this.video,
            engine: 'dom',
            comments: comments,
            speed: 144 * this.settings.speed
        });
    }

    updateSettings(settings) {
        const oldSettings = { ...this.settings };
        this.settings = { ...this.settings, ...settings };

        if (!this.danmaku) return;

        if (settings.hasOwnProperty('enabled')) {
            if (this.settings.enabled) {
                this.danmaku.show();
            } else {
                this.danmaku.hide();
            }
        }

        if (settings.hasOwnProperty('opacity')) {
            this.container.style.setProperty('--danmaku-opacity', this.settings.opacity / 100);
        }

        if (settings.hasOwnProperty('fontSize')) {
            this.container.style.setProperty('--danmaku-font-size', `${this.settings.fontSize}px`);
        }

        if (settings.hasOwnProperty('displayAreaPercentage')) {
            this.container.style.height = `${this.settings.displayAreaPercentage}%`;
            this.danmaku.resize();
        }

        if (settings.hasOwnProperty('speed')) {
            this.danmaku.speed = 144 * this.settings.speed;
        }

        if (
            (settings.hasOwnProperty('fontSize') &&
                oldSettings.fontSize !== this.settings.fontSize) ||
            (settings.hasOwnProperty('weightThreshold') &&
                oldSettings.weightThreshold !== this.settings.weightThreshold) ||
            (settings.hasOwnProperty('timeOffset') &&
                oldSettings.timeOffset !== this.settings.timeOffset)
        ) {
            this.loadDanmakus(this.originalDanmakus);
        }
    }

    clear() {
        if (this.danmaku) {
            this.danmaku.clear();
        }
    }

    destroy() {
        if (this.danmaku) {
            this.danmaku.destroy();
        }
        if (this.resizeObserver) {
            this.resizeObserver.disconnect();
        }
    }
}

// ES模块导出
export default DanmakuEngine;

// 兼容旧的脚本加载方式
if (typeof window !== 'undefined') {
    window.DanmakuEngine = DanmakuEngine;
}
