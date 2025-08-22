import { defineWebExtConfig } from 'wxt';

export default defineWebExtConfig({
    // 配置持久化的Chrome用户数据目录, 可以保存登录状态、Cookie等数据，方便开发时无需重复登录B站
    chromiumArgs: ['--user-data-dir=./.wxt/chrome-data'],

    // Firefox配置说明：
    // WXT不支持Firefox的--user-data-dir，需要通过指定自定义配置文件实现持久化
    //
    // 1. 在Firefox中进入 about:profiles 页面
    // 2. 创建新配置文件，如 "wxt-dev-profile"
    // 3. 点击 "Launch profile in new browser" 打开新窗口
    // 4. 在新窗口中登录B站并保存登录状态
    // 5. 关闭该窗口，然后运行 npm run dev:firefox
    // 注意：直接通过npm run dev:firefox登录的状态不会被保存！
    firefoxProfile: 'wxt-dev-profile'
});
