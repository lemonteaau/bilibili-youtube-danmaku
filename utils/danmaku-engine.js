import Danmaku from 'danmaku/dist/esm/danmaku.dom.js';

const settingHandlers = {
    enabled: (engine, value) => {
        if (value) engine.danmaku.show();
        else engine.danmaku.hide();
    },
    opacity: (engine, value) => {
        engine.container.style.setProperty('--danmaku-opacity', value / 100);
    },
    displayAreaPercentage: (engine, value) => {
        engine.container.style.height = `${value}%`;
        engine.danmaku.resize();
    },
    speed: (engine, value) => {
        engine.danmaku.speed = 144 * value;
    },
    // These settings trigger a full reload
    fontSize: 'reload',
    trackSpacing: 'reload',
    weightThreshold: 'reload',
    timeOffset: 'reload'
};

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
            trackSpacing: 8,
            displayAreaPercentage: 100,
            weightThreshold: 0
        };
        this.video = document.querySelector('video');
        this.originalDanmakus = [];
        this.init();
    }

    // 创建VideoProxy，让弹幕速度不跟随视频倍速
    // 当Danmaku尝试读取 playbackRate 属性时，VideoProxy会介入并始终返回 `1`。
    // 对于所有其他属性（如 currentTime、paused 等），VideoProxy则会返回真实视频元素的值，确保弹幕的出现时机等其他功能正常。
    createVideoProxy(video) {
        return new Proxy(video, {
            get(target, prop) {
                if (prop === 'playbackRate') {
                    return 1;
                }
                const value = target[prop];
                if (typeof value === 'function') {
                    return value.bind(target);
                }
                return value;
            }
        });
    }

    init() {
        this.container.style.setProperty('--danmaku-font-size', `${this.settings.fontSize}px`);
        this.container.style.setProperty('--danmaku-opacity', this.settings.opacity / 100);

        const videoProxy = this.createVideoProxy(this.video);
        this.danmaku = new Danmaku({
            container: this.container,
            media: videoProxy,
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
                const { fontSize: defaultFontSize, timeOffset, trackSpacing } = this.settings;
                const finalFontSize = d.fontSize || defaultFontSize;

                const style = {
                    color: d.color || '#ffffff',
                    fontSize: `${finalFontSize}px`,
                    fontFamily: "SimHei, 'Microsoft YaHei', Arial, sans-serif",
                    fontWeight: 'bold',
                    textShadow:
                        '-1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000, 0 0 2px #000'
                };

                if (trackSpacing !== 8) {
                    style.lineHeight = `${finalFontSize + trackSpacing}px`;
                }

                return {
                    text: d.text,
                    time: d.time + timeOffset,
                    mode: d.mode || 'rtl',
                    style
                };
            });

        this.container.style.setProperty('--danmaku-font-size', `${this.settings.fontSize}px`);

        const videoProxy = this.createVideoProxy(this.video);
        this.danmaku = new Danmaku({
            container: this.container,
            media: videoProxy,
            engine: 'dom',
            comments: comments,
            speed: 144 * this.settings.speed
        });
    }

    updateSettings(settings) {
        const oldSettings = { ...this.settings };
        this.settings = { ...this.settings, ...settings };

        if (!this.danmaku) return;

        let needsReload = false;

        for (const key in settings) {
            if (oldSettings[key] === this.settings[key]) {
                continue; // Skip if value hasn't changed
            }

            const handler = settingHandlers[key];
            if (handler === 'reload') {
                needsReload = true;
            } else if (typeof handler === 'function') {
                handler(this, this.settings[key]);
            }
        }

        if (needsReload) {
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
