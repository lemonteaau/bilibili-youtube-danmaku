// B站番剧处理模块
// 依赖: background.js 中的 WBI 签名函数

// B站番剧搜索功能 - 直接返回指定集数的bvid
async function searchBilibiliBangumi(title, episode) {
    try {
        console.log(`搜索番剧: ${title}, 第${episode}集`);

        // 获取WBI Keys (来自background.js)
        const wbiKeys = await getWbiKeys();

        // 构建API参数 - 使用分类搜索
        const params = {
            search_type: 'media_bangumi',
            keyword: title,
            page: 1,
            wts: Math.round(Date.now() / 1000)
        };

        // 生成签名 (来自background.js)
        const query = encWbi(params, wbiKeys.img_key, wbiKeys.sub_key);
        const apiUrl = `https://api.bilibili.com/x/web-interface/wbi/search/type?${query}`;

        console.log(`番剧搜索API URL: ${apiUrl}`);

        // 发起API请求
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                Referer: 'https://www.bilibili.com/',
                Origin: 'https://www.bilibili.com'
            }
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        console.log('番剧搜索API返回:', data);

        if (data.code !== 0) {
            throw new Error(`API错误: ${data.message}`);
        }

        // 解析搜索结果
        const searchResults = data.data?.result || [];
        console.log(`找到 ${searchResults.length} 个番剧结果`);

        if (searchResults.length === 0) {
            throw new Error('未找到匹配的番剧');
        }

        // 查找标题完全匹配的番剧（一般为第一项）
        const exactMatch = searchResults.find(
            (item) => item.title && item.title.trim() === title.trim()
        );

        const bangumi = exactMatch || searchResults[0];
        // console.log('使用番剧:', bangumi.title, '集数数组:', bangumi.eps);

        if (!bangumi.eps || bangumi.eps.length === 0) {
            throw new Error('番剧没有集数信息');
        }

        // 在eps数组中查找对应的集数
        const targetEpisode = findEpisodeByNumber(bangumi.eps, episode);
        if (!targetEpisode) {
            throw new Error(`未找到第${episode}集`);
        }

        console.log(`找到目标集数:`, targetEpisode);

        // 获取剧集明细，获取bvid
        const episodeDetail = await getBangumiEpisodeDetail(targetEpisode.id);
        // console.log('剧集明细:', episodeDetail);

        if (!episodeDetail.bvid) {
            throw new Error('未找到视频BVID');
        }

        // 直接返回bvid
        return episodeDetail.bvid;
    } catch (error) {
        console.error('番剧搜索失败:', error);
        throw error;
    }
}

// 根据集数匹配对应的 epid
function findEpisodeByNumber(eps, episodeNumber) {
    if (!eps || !Array.isArray(eps)) {
        console.log('eps数组为空或无效');
        return null;
    }

    console.log(`在 ${eps.length} 集中查找第 ${episodeNumber} 话`);

    // 优先精确匹配集数
    const exactMatch = eps.find((ep) => {
        if (!ep.title) return false;

        // 匹配 "第X话" 格式
        const match = ep.title.match(/第(\d+)话/);
        if (match) {
            const epNumber = parseInt(match[1]);
            console.log(`找到集数: ${ep.title} -> ${epNumber}`);
            return epNumber === episodeNumber;
        }

        // 匹配纯数字格式
        const numMatch = ep.title.match(/^(\d+)$/);
        if (numMatch) {
            const epNumber = parseInt(numMatch[1]);
            // console.log(`找到纯数字集数: ${ep.title} -> ${epNumber}`);
            return epNumber === episodeNumber;
        }

        return false;
    });

    if (exactMatch) {
        console.log(`精确匹配找到: ${exactMatch.title} (id: ${exactMatch.id})`);
        return exactMatch;
    }

    // 如果精确匹配失败，尝试索引匹配 (episodeNumber - 1)
    if (episodeNumber > 0 && episodeNumber <= eps.length) {
        const indexMatch = eps[episodeNumber - 1];
        console.log(`索引匹配找到: ${indexMatch.title} (id: ${indexMatch.id})`);
        return indexMatch;
    }

    console.log(`未找到第 ${episodeNumber} 话对应的集数`);
    return null;
}

// 获取番剧剧集明细
async function getBangumiEpisodeDetail(epid) {
    try {
        console.log(`获取剧集明细: epid=${epid}`);

        const apiUrl = `https://api.bilibili.com/pgc/view/web/season?ep_id=${epid}`;
        // console.log(`剧集明细API URL: ${apiUrl}`);

        // 发起API请求
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                Referer: 'https://www.bilibili.com/',
                Origin: 'https://www.bilibili.com'
            }
        });

        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }

        const data = await response.json();
        // console.log('剧集明细API返回:', data);

        if (data.code !== 0) {
            throw new Error(`API错误: ${data.message}`);
        }

        // 查找当前集数的详细信息
        const episodes = data.result?.episodes || [];
        const currentEpisode = episodes.find((ep) => ep.id === epid);

        if (!currentEpisode) {
            throw new Error('未找到对应的集数信息');
        }

        console.log('找到当前集数:', currentEpisode);

        // 返回bvid和相关信息
        return {
            title: currentEpisode.title,
            bvid: currentEpisode.bvid,
            cid: currentEpisode.cid,
            aid: currentEpisode.aid,
            duration: currentEpisode.duration,
            pub_time: currentEpisode.pub_time
        };
    } catch (error) {
        console.error('获取剧集明细失败:', error);
        throw error;
    }
}

// 导出函数供background.js使用
if (typeof window === 'undefined') {
    // Node.js环境或Web Worker环境
    this.searchBilibiliBangumi = searchBilibiliBangumi;
    this.findEpisodeByNumber = findEpisodeByNumber;
    this.getBangumiEpisodeDetail = getBangumiEpisodeDetail;
}
