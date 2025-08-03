// WBI签名相关配置
const mixinKeyEncTab = [
    46, 47, 18, 2, 53, 8, 23, 32, 15, 50, 10, 31, 58, 3, 45, 35, 27, 43, 5, 49,
    33, 9, 42, 19, 29, 28, 14, 39, 12, 38, 41, 13, 37, 48, 7, 16, 24, 55, 40,
    61, 26, 17, 0, 1, 60, 51, 30, 4, 22, 25, 54, 21, 56, 59, 6, 63, 57, 62, 11,
    36, 20, 34, 44, 52
];

// 对 imgKey 和 subKey 进行字符顺序打乱编码
const getMixinKey = (orig) => mixinKeyEncTab.map(n => orig[n]).join('').slice(0, 32);

// 纯JavaScript实现的MD5算法
function md5(string) {
    function RotateLeft(lValue, iShiftBits) {
        return (lValue<<iShiftBits) | (lValue>>>(32-iShiftBits));
    }
 
    function AddUnsigned(lX,lY) {
        var lX4,lY4,lX8,lY8,lResult;
        lX8 = (lX & 0x80000000);
        lY8 = (lY & 0x80000000);
        lX4 = (lX & 0x40000000);
        lY4 = (lY & 0x40000000);
        lResult = (lX & 0x3FFFFFFF)+(lY & 0x3FFFFFFF);
        if (lX4 & lY4) {
            return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
        }
        if (lX4 | lY4) {
            if (lResult & 0x40000000) {
                return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
            } else {
                return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
            }
        } else {
            return (lResult ^ lX8 ^ lY8);
        }
    }
 
    function F(x,y,z) { return (x & y) | ((~x) & z); }
    function G(x,y,z) { return (x & z) | (y & (~z)); }
    function H(x,y,z) { return (x ^ y ^ z); }
    function I(x,y,z) { return (y ^ (x | (~z))); }
 
    function FF(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(F(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function GG(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(G(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function HH(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(H(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function II(a,b,c,d,x,s,ac) {
        a = AddUnsigned(a, AddUnsigned(AddUnsigned(I(b, c, d), x), ac));
        return AddUnsigned(RotateLeft(a, s), b);
    };
 
    function ConvertToWordArray(string) {
        var lWordCount;
        var lMessageLength = string.length;
        var lNumberOfWords_temp1=lMessageLength + 8;
        var lNumberOfWords_temp2=(lNumberOfWords_temp1-(lNumberOfWords_temp1 % 64))/64;
        var lNumberOfWords = (lNumberOfWords_temp2+1)*16;
        var lWordArray=Array(lNumberOfWords-1);
        var lBytePosition = 0;
        var lByteCount = 0;
        while ( lByteCount < lMessageLength ) {
            lWordCount = (lByteCount-(lByteCount % 4))/4;
            lBytePosition = (lByteCount % 4)*8;
            lWordArray[lWordCount] = (lWordArray[lWordCount] | (string.charCodeAt(lByteCount)<<lBytePosition));
            lByteCount++;
        }
        lWordCount = (lByteCount-(lByteCount % 4))/4;
        lBytePosition = (lByteCount % 4)*8;
        lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80<<lBytePosition);
        lWordArray[lNumberOfWords-2] = lMessageLength<<3;
        lWordArray[lNumberOfWords-1] = lMessageLength>>>29;
        return lWordArray;
    };
 
    function WordToHex(lValue) {
        var WordToHexValue="",WordToHexValue_temp="",lByte,lCount;
        for (lCount = 0;lCount<=3;lCount++) {
            lByte = (lValue>>>(lCount*8)) & 255;
            WordToHexValue_temp = "0" + lByte.toString(16);
            WordToHexValue = WordToHexValue + WordToHexValue_temp.substr(WordToHexValue_temp.length-2,2);
        }
        return WordToHexValue;
    };
 
    function Utf8Encode(string) {
        string = string.replace(/\r\n/g,"\n");
        var utftext = "";
 
        for (var n = 0; n < string.length; n++) {
            var c = string.charCodeAt(n);
            if (c < 128) {
                utftext += String.fromCharCode(c);
            }
            else if((c > 127) && (c < 2048)) {
                utftext += String.fromCharCode((c >> 6) | 192);
                utftext += String.fromCharCode((c & 63) | 128);
            }
            else {
                utftext += String.fromCharCode((c >> 12) | 224);
                utftext += String.fromCharCode(((c >> 6) & 63) | 128);
                utftext += String.fromCharCode((c & 63) | 128);
            }
        }
        return utftext;
    };
 
    var x=Array();
    var k,AA,BB,CC,DD,a,b,c,d;
    var S11=7, S12=12, S13=17, S14=22;
    var S21=5, S22=9 , S23=14, S24=20;
    var S31=4, S32=11, S33=16, S34=23;
    var S41=6, S42=10, S43=15, S44=21;
 
    string = Utf8Encode(string);
    x = ConvertToWordArray(string);
    a = 0x67452301; b = 0xEFCDAB89; c = 0x98BADCFE; d = 0x10325476;
 
    for (k=0;k<x.length;k+=16) {
        AA=a; BB=b; CC=c; DD=d;
        a=FF(a,b,c,d,x[k+0], S11,0xD76AA478);
        d=FF(d,a,b,c,x[k+1], S12,0xE8C7B756);
        c=FF(c,d,a,b,x[k+2], S13,0x242070DB);
        b=FF(b,c,d,a,x[k+3], S14,0xC1BDCEEE);
        a=FF(a,b,c,d,x[k+4], S11,0xF57C0FAF);
        d=FF(d,a,b,c,x[k+5], S12,0x4787C62A);
        c=FF(c,d,a,b,x[k+6], S13,0xA8304613);
        b=FF(b,c,d,a,x[k+7], S14,0xFD469501);
        a=FF(a,b,c,d,x[k+8], S11,0x698098D8);
        d=FF(d,a,b,c,x[k+9], S12,0x8B44F7AF);
        c=FF(c,d,a,b,x[k+10],S13,0xFFFF5BB1);
        b=FF(b,c,d,a,x[k+11],S14,0x895CD7BE);
        a=FF(a,b,c,d,x[k+12],S11,0x6B901122);
        d=FF(d,a,b,c,x[k+13],S12,0xFD987193);
        c=FF(c,d,a,b,x[k+14],S13,0xA679438E);
        b=FF(b,c,d,a,x[k+15],S14,0x49B40821);
        a=GG(a,b,c,d,x[k+1], S21,0xF61E2562);
        d=GG(d,a,b,c,x[k+6], S22,0xC040B340);
        c=GG(c,d,a,b,x[k+11],S23,0x265E5A51);
        b=GG(b,c,d,a,x[k+0], S24,0xE9B6C7AA);
        a=GG(a,b,c,d,x[k+5], S21,0xD62F105D);
        d=GG(d,a,b,c,x[k+10],S22,0x2441453);
        c=GG(c,d,a,b,x[k+15],S23,0xD8A1E681);
        b=GG(b,c,d,a,x[k+4], S24,0xE7D3FBC8);
        a=GG(a,b,c,d,x[k+9], S21,0x21E1CDE6);
        d=GG(d,a,b,c,x[k+14],S22,0xC33707D6);
        c=GG(c,d,a,b,x[k+3], S23,0xF4D50D87);
        b=GG(b,c,d,a,x[k+8], S24,0x455A14ED);
        a=GG(a,b,c,d,x[k+13],S21,0xA9E3E905);
        d=GG(d,a,b,c,x[k+2], S22,0xFCEFA3F8);
        c=GG(c,d,a,b,x[k+7], S23,0x676F02D9);
        b=GG(b,c,d,a,x[k+12],S24,0x8D2A4C8A);
        a=HH(a,b,c,d,x[k+5], S31,0xFFFA3942);
        d=HH(d,a,b,c,x[k+8], S32,0x8771F681);
        c=HH(c,d,a,b,x[k+11],S33,0x6D9D6122);
        b=HH(b,c,d,a,x[k+14],S34,0xFDE5380C);
        a=HH(a,b,c,d,x[k+1], S31,0xA4BEEA44);
        d=HH(d,a,b,c,x[k+4], S32,0x4BDECFA9);
        c=HH(c,d,a,b,x[k+7], S33,0xF6BB4B60);
        b=HH(b,c,d,a,x[k+10],S34,0xBEBFBC70);
        a=HH(a,b,c,d,x[k+13],S31,0x289B7EC6);
        d=HH(d,a,b,c,x[k+0], S32,0xEAA127FA);
        c=HH(c,d,a,b,x[k+3], S33,0xD4EF3085);
        b=HH(b,c,d,a,x[k+6], S34,0x4881D05);
        a=HH(a,b,c,d,x[k+9], S31,0xD9D4D039);
        d=HH(d,a,b,c,x[k+12],S32,0xE6DB99E5);
        c=HH(c,d,a,b,x[k+15],S33,0x1FA27CF8);
        b=HH(b,c,d,a,x[k+2], S34,0xC4AC5665);
        a=II(a,b,c,d,x[k+0], S41,0xF4292244);
        d=II(d,a,b,c,x[k+7], S42,0x432AFF97);
        c=II(c,d,a,b,x[k+14],S43,0xAB9423A7);
        b=II(b,c,d,a,x[k+5], S44,0xFC93A039);
        a=II(a,b,c,d,x[k+12],S41,0x655B59C3);
        d=II(d,a,b,c,x[k+3], S42,0x8F0CCC92);
        c=II(c,d,a,b,x[k+10],S43,0xFFEFF47D);
        b=II(b,c,d,a,x[k+1], S44,0x85845DD1);
        a=II(a,b,c,d,x[k+8], S41,0x6FA87E4F);
        d=II(d,a,b,c,x[k+15],S42,0xFE2CE6E0);
        c=II(c,d,a,b,x[k+6], S43,0xA3014314);
        b=II(b,c,d,a,x[k+13],S44,0x4E0811A1);
        a=II(a,b,c,d,x[k+4], S41,0xF7537E82);
        d=II(d,a,b,c,x[k+11],S42,0xBD3AF235);
        c=II(c,d,a,b,x[k+2], S43,0x2AD7D2BB);
        b=II(b,c,d,a,x[k+9], S44,0xEB86D391);
        a=AddUnsigned(a,AA);
        b=AddUnsigned(b,BB);
        c=AddUnsigned(c,CC);
        d=AddUnsigned(d,DD);
    }
 
    var temp = WordToHex(a)+WordToHex(b)+WordToHex(c)+WordToHex(d);
    return temp.toLowerCase();
}

// 为请求参数进行 wbi 签名
function encWbi(params, img_key, sub_key) {
    const mixin_key = getMixinKey(img_key + sub_key);
    const curr_time = Math.round(Date.now() / 1000);
    const chr_filter = /[!'()*]/g;

    const safeParams = {};
    for (const [key, value] of Object.entries(params)) {
        if (value !== undefined && value !== null) {
            safeParams[key] = String(value).replace(chr_filter, '');
        }
    }
    
    safeParams.wts = curr_time;
    
    const query = Object.keys(safeParams)
        .sort()
        .map(key => {
            return `${encodeURIComponent(key)}=${encodeURIComponent(safeParams[key])}`;
        })
        .join('&');

    const wbi_sign = md5(query + mixin_key);
    return query + '&w_rid=' + wbi_sign;
}

// 获取最新的 img_key 和 sub_key
async function getWbiKeys() {
    const response = await fetch('https://api.bilibili.com/x/web-interface/nav', {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': 'https://www.bilibili.com/'
        }
    });
    
    const data = await response.json();
    if (!data.data?.wbi_img) {
        throw new Error('无法获取WBI Keys');
    }

    const { img_url, sub_url } = data.data.wbi_img;
    const img_key = img_url.slice(img_url.lastIndexOf('/') + 1, img_url.lastIndexOf('.'));
    const sub_key = sub_url.slice(sub_url.lastIndexOf('/') + 1, sub_url.lastIndexOf('.'));
    
    return { img_key, sub_key };
}

// 获取视频信息
async function getVideoInfo(bvid) {
    const response = await fetch(`https://api.bilibili.com/x/web-interface/view?bvid=${bvid}`);
    const data = await response.json();
    
    if (data.code !== 0) throw new Error(`获取视频信息失败: ${data.message}`);
    if (!data.data?.aid || !data.data?.cid) throw new Error('无法获取视频信息');
    
    return {
        aid: data.data.aid,
        cid: data.data.cid,
        duration: data.data.duration,
        title: data.data.title
    };
}

// 获取单个分段的弹幕
async function getSegmentDanmaku(cid, aid, segmentIndex, wbiKeys) {
    const params = {
        type: 1,
        oid: cid,
        segment_index: segmentIndex,
        pid: aid,
        web_location: 1315873,
        wts: Math.round(Date.now() / 1000)
    };
    
    const query = encWbi(params, wbiKeys.img_key, wbiKeys.sub_key);
    const url = `https://api.bilibili.com/x/v2/dm/wbi/web/seg.so?${query}`;
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const buffer = await response.arrayBuffer();
    return parseDanmakuData(buffer);
}

// 引入protobuf解析器和OpenCC库
importScripts('../lib/protobuf-parser.js');
importScripts('../lib/opencc.min.js');

// 初始化OpenCC转换器
let openccConverter = null;
try {
    // 创建繁体转简体的转换器
    openccConverter = OpenCC.Converter({ from: 'tw', to: 'cn' });
    console.log('OpenCC转换器初始化成功');
} catch (error) {
    console.error('OpenCC转换器初始化失败:', error);
}

// 繁体转简体函数
function traditionalToSimplifiedChinese(text) {
    if (!text || typeof text !== 'string') return text;
    
    try {
        // 使用OpenCC进行转换
        if (openccConverter) {
            const result = openccConverter(text);
            console.log(`繁简转换: ${text} → ${result}`);
            return result;
        } else {
            console.warn('OpenCC转换器未初始化，返回原文本');
            return text;
        }
    } catch (error) {
        console.error('繁简转换失败:', error);
        return text;
    }
}

// 解析弹幕数据
function parseDanmakuData(buffer) {
    const parser = new ProtobufParser();
    return parser.parseDanmakuResponse(buffer);
}

// 下载所有弹幕
async function downloadAllDanmaku(bvid) {
    try {
        // 1. 获取WBI Keys
        const wbiKeys = await getWbiKeys();
        
        // 2. 获取视频信息
        const { cid, duration, aid, title } = await getVideoInfo(bvid);
        
        // 3. 计算分段数（每段6分钟）
        const segmentCount = Math.ceil(duration / 360);
        
        // 4. 获取所有分段的弹幕
        const allDanmakus = [];
        for (let i = 1; i <= segmentCount; i++) {
            try {
                const danmakus = await getSegmentDanmaku(cid, aid, i, wbiKeys);
                console.log(`第${i}段弹幕获取成功: ${danmakus.length}条`);
                allDanmakus.push(...danmakus);
                
                // 延迟避免请求过快
                if (i < segmentCount) {
                    await new Promise(resolve => setTimeout(resolve, 300));
                }
            } catch (error) {
                console.error(`获取第${i}段弹幕失败:`, error);
            }
        }
        
        // 5. 格式化弹幕数据，增加安全检查
        console.log(`开始处理 ${allDanmakus.length} 条原始弹幕数据`);
        
        const validDanmakus = allDanmakus.filter(d => {
            // 过滤掉无效的弹幕数据
            const isValid = d && 
                           typeof d.progress === 'number' && 
                           d.content && 
                           typeof d.content === 'string' &&
                           d.content.trim().length > 0;
            
            if (!isValid) {
                console.warn('过滤掉无效弹幕:', d);
            }
            return isValid;
        });
        
        console.log(`过滤后有效弹幕: ${validDanmakus.length} 条`);
        
        const formattedDanmakus = validDanmakus.map(d => ({
            time: d.progress / 1000, // 转换为秒
            text: d.content,
            color: d.color && typeof d.color === 'number' 
                ? `#${d.color.toString(16).padStart(6, '0')}` 
                : '#ffffff', // 默认白色
            mode: d.mode === 1 ? 'rtl' : (d.mode === 4 ? 'bottom' : 'top'),
            weight: (d.weight !== undefined && d.weight !== null) ? d.weight : 5 // 添加权重字段，默认5
        }));
        
        // 按时间排序
        formattedDanmakus.sort((a, b) => a.time - b.time);
        
        // 统计weight分布（用于调试）
        const weightStats = {};
        formattedDanmakus.forEach(d => {
            const weight = d.weight;
            weightStats[weight] = (weightStats[weight] || 0) + 1;
        });
        console.log('弹幕权重分布:', weightStats);
        
        return {
            danmakus: formattedDanmakus,
            title: title,
            duration: duration
        };
    } catch (error) {
        throw error;
    }
}

// B站空间搜索功能
async function searchBilibiliVideo(bilibiliUID, videoTitle) {
    try {
        // 繁体转简体
        const simplifiedTitle = traditionalToSimplifiedChinese(videoTitle);
        console.log(`搜索标题: ${videoTitle} → ${simplifiedTitle}`);
        
        // 获取WBI Keys
        const wbiKeys = await getWbiKeys();
        
        // 构建API参数
        const params = {
            mid: bilibiliUID,
            ps: 30,
            tid: 0,
            pn: 1,
            keyword: simplifiedTitle,
            order: 'pubdate',
            web_location: 1550101,
            wts: Math.round(Date.now() / 1000)
        };
        
        // 生成签名
        const query = encWbi(params, wbiKeys.img_key, wbiKeys.sub_key);
        const apiUrl = `https://api.bilibili.com/x/space/wbi/arc/search?${query}`;
        
        console.log(`API搜索URL: ${apiUrl}`);
        
        // 发起API请求
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
                'Referer': 'https://www.bilibili.com/',
                'Origin': 'https://www.bilibili.com'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API请求失败: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.code !== 0) {
            throw new Error(`API返回错误: ${data.message || '未知错误'}`);
        }
        
        // 解析API响应数据
        const results = parseBilibiliApiResults(data);
        
        console.log(`搜索到 ${results.length} 个结果`);
        
        // 优先寻找标题精确匹配的结果
        let finalResults = results;
        if (results.length > 1) {
            const exactMatch = results.find(result => result.title === simplifiedTitle);
            if (exactMatch) {
                console.log(`找到精确匹配的标题: ${exactMatch.title}`);
                finalResults = [exactMatch];
            }
        }
        
        return {
            success: true,
            results: finalResults,
            searchUrl: apiUrl
        };
        
    } catch (error) {
        console.error('B站搜索失败:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// 解析B站API搜索结果
function parseBilibiliApiResults(apiData) {
    const results = [];
    
    try {
        // 检查API数据结构
        if (!apiData.data || !apiData.data.list || !apiData.data.list.vlist) {
            console.warn('API数据结构异常:', apiData);
            return results;
        }
        
        const videoList = apiData.data.list.vlist;
        
        // 最多返回10个结果
        const maxResults = Math.min(videoList.length, 10);
        
        for (let i = 0; i < maxResults; i++) {
            const video = videoList[i];
            
            if (video.bvid && video.title) {
                // 格式化时长（从秒转换为mm:ss格式）
                const formatDuration = (seconds) => {
                    const mins = Math.floor(seconds / 60);
                    const secs = seconds % 60;
                    return `${mins}:${secs.toString().padStart(2, '0')}`;
                };
                
                // 格式化发布时间
                const formatPubdate = (timestamp) => {
                    const date = new Date(timestamp * 1000);
                    return date.toLocaleDateString('zh-CN');
                };
                
                results.push({
                    bvid: video.bvid,
                    title: video.title,
                    pubdate: video.created ? formatPubdate(video.created) : '未知',
                    created: video.created || 0, // 保存原始时间戳用于排序
                    aid: video.aid,
                    pic: video.pic // 视频封面
                });
            }
        }
        
        // 按发布时间从新到旧排序
        results.sort((a, b) => b.created - a.created);
        
        console.log(`成功解析 ${results.length} 个视频结果，已按时间排序`);
        
    } catch (error) {
        console.error('解析API结果失败:', error);
    }
    
    return results;
}

// 存储待发送的搜索结果
let pendingSearchResults = null;

// 存储待发送的未匹配结果
let pendingNoMatchResults = null;

// 处理多个搜索结果的弹窗显示
async function handleMultipleResults(request) {
    try {
        console.log('处理多个搜索结果弹窗:', request.results.length);
        
        // 暂存搜索结果，等待popup准备好接收
        pendingSearchResults = {
            results: request.results,
            youtubeVideoId: request.youtubeVideoId,
            channelInfo: request.channelInfo,
            videoTitle: request.videoTitle,
            timestamp: Date.now()
        };
        
        // 同时存储到storage作为备用
        await chrome.storage.local.set({
            'pendingSearchResults': pendingSearchResults
        });
        
        // 打开popup窗口
        try {
            await chrome.action.openPopup();
            console.log('popup窗口已打开，等待ready信号...');
        } catch (error) {
            console.log('无法自动打开popup，可能需要用户手动点击:', error.message);
        }
        
        return {
            success: true,
            message: '搜索结果已准备显示'
        };
        
    } catch (error) {
        console.error('处理多个搜索结果失败:', error);
        throw error;
    }
}

// 处理未匹配结果的弹窗显示
async function handleNoMatchResults(request) {
    try {
        console.log('处理未匹配结果弹窗:', request.channelInfo);
        
        // 暂存未匹配结果，等待popup准备好接收
        pendingNoMatchResults = {
            youtubeVideoId: request.youtubeVideoId,
            channelInfo: request.channelInfo,
            videoTitle: request.videoTitle,
            timestamp: Date.now()
        };
        
        // 同时存储到storage作为备用
        await chrome.storage.local.set({
            'pendingNoMatchResults': pendingNoMatchResults
        });
        
        // 打开popup窗口
        try {
            await chrome.action.openPopup();
            console.log('popup窗口已打开，等待ready信号...');
        } catch (error) {
            console.log('无法自动打开popup，可能需要用户手动点击:', error.message);
        }
        
        return {
            success: true,
            message: '未匹配结果已准备显示'
        };
        
    } catch (error) {
        console.error('处理未匹配结果失败:', error);
        throw error;
    }
}

// 清理过期弹幕数据（异步执行，不阻塞主流程）
async function cleanupExpiredDanmaku() {
    try {
        const allData = await chrome.storage.local.get();
        const keysToRemove = [];
        const oneDay = 60 * 1000; // 1天过期时间
        
        console.log('开始检查过期弹幕数据...');
        
        for (const [key, value] of Object.entries(allData)) {
            // 跳过非弹幕数据（如设置、临时数据等）
            if (!value || !value.danmakus || !value.lastUpdate) {
                continue;
            }
            
            // 检查是否过期
            if (Date.now() - value.lastUpdate > oneDay) {
                keysToRemove.push(key);
            }
        }
        
        if (keysToRemove.length > 0) {
            await chrome.storage.local.remove(keysToRemove);
            console.log(`已清理 ${keysToRemove.length} 个过期弹幕数据`);
        } else {
            console.log('没有发现过期的弹幕数据');
        }
    } catch (error) {
        console.error('清理过期弹幕数据失败:', error);
    }
}

// 扩展启动时清理过期数据
chrome.runtime.onStartup.addListener(() => {
    console.log('浏览器启动，异步清理过期弹幕数据');
    cleanupExpiredDanmaku();
});

chrome.runtime.onInstalled.addListener(() => {
    console.log('扩展安装/更新，异步清理过期弹幕数据');
    cleanupExpiredDanmaku();
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === 'downloadDanmaku') {
        downloadAllDanmaku(request.bvid)
            .then(async (data) => {
                // 保存弹幕数据
                const storageData = {
                    [request.youtubeVideoId]: {
                        bilibili_url: `https://www.bilibili.com/video/${request.bvid}`,
                        bilibili_title: data.title,
                        danmakus: data.danmakus,
                        duration: data.duration,
                        timeOffset: 0,
                        lastUpdate: Date.now()
                    }
                };
                
                await chrome.storage.local.set(storageData);
                
                // 异步清理过期弹幕数据，不阻塞响应
                Promise.resolve().then(() => {
                    cleanupExpiredDanmaku();
                });
                
                sendResponse({
                    success: true,
                    count: data.danmakus.length
                });
            })
            .catch(error => {
                sendResponse({
                    success: false,
                    error: error.message
                });
            });
        
        return true; // 保持消息通道开启
    } else if (request.type === 'searchBilibiliVideo') {
        // 新增：B站视频搜索
        searchBilibiliVideo(request.bilibiliUID, request.videoTitle)
            .then(result => {
                sendResponse(result);
            })
            .catch(error => {
                sendResponse({
                    success: false,
                    error: error.message
                });
            });
        
        return true; // 保持消息通道开启
    } else if (request.type === 'showMultipleResults') {
        // 新增：处理多个搜索结果的弹窗显示
        handleMultipleResults(request)
            .then(result => {
                sendResponse(result);
            })
            .catch(error => {
                sendResponse({
                    success: false,
                    error: error.message
                });
            });
        
        return true; // 保持消息通道开启
    } else if (request.type === 'showNoMatchResults') {
        // 新增：处理未匹配结果的弹窗显示
        handleNoMatchResults(request)
            .then(result => {
                sendResponse(result);
            })
            .catch(error => {
                sendResponse({
                    success: false,
                    error: error.message
                });
            });
        
        return true; // 保持消息通道开启
    } else if (request.type === 'popupReady') {
        // popup已准备好，发送待显示的搜索结果
        console.log('收到popup ready信号，检查待发送的搜索结果...');
        
        // 处理异步操作
        (async () => {
            // 优先使用内存中的数据
            let dataToSend = pendingSearchResults;
            let noMatchDataToSend = pendingNoMatchResults;
            
            // 如果内存中没有数据，尝试从storage获取
            if (!dataToSend && !noMatchDataToSend) {
                try {
                    const result = await chrome.storage.local.get(['pendingSearchResults', 'pendingNoMatchResults']);
                    dataToSend = result.pendingSearchResults;
                    noMatchDataToSend = result.pendingNoMatchResults;
                } catch (error) {
                    console.log('获取storage搜索结果失败:', error);
                }
            }
            
            if (dataToSend && dataToSend.results) {
                // 检查数据是否过期（5分钟内有效）
                const isExpired = Date.now() - dataToSend.timestamp > 5 * 60 * 1000;
                
                if (!isExpired) {
                    console.log('发送搜索结果给popup:', dataToSend.results.length);
                    
                    // 发送搜索结果给popup（使用延迟确保popup完全准备好）
                    setTimeout(() => {
                        chrome.runtime.sendMessage({
                            type: 'displayMultipleResults',
                            data: dataToSend
                        }).then(() => {
                            // 发送成功后清理storage中的数据
                            chrome.storage.local.remove('pendingSearchResults');
                            pendingSearchResults = null;
                            console.log('已清理pendingSearchResults数据');
                        }).catch(error => {
                            console.log('发送搜索结果消息失败:', error);
                        });
                    }, 50); // 50ms延迟确保popup DOM准备就绪
                    
                    sendResponse({ success: true });
                } else {
                    console.log('搜索结果已过期，清理数据');
                    pendingSearchResults = null;
                    chrome.storage.local.remove('pendingSearchResults');
                    sendResponse({ success: false, message: 'results expired' });
                }
            } else if (noMatchDataToSend) {
                // 检查未匹配数据是否过期（5分钟内有效）
                const isExpired = Date.now() - noMatchDataToSend.timestamp > 5 * 60 * 1000;
                
                if (!isExpired) {
                    console.log('发送未匹配结果给popup:', noMatchDataToSend.channelInfo);
                    
                    // 发送未匹配结果给popup（使用延迟确保popup完全准备好）
                    setTimeout(() => {
                        chrome.runtime.sendMessage({
                            type: 'displayNoMatchResults',
                            data: noMatchDataToSend
                        }).then(() => {
                            // 发送成功后清理storage中的数据
                            chrome.storage.local.remove('pendingNoMatchResults');
                            pendingNoMatchResults = null;
                            console.log('已清理pendingNoMatchResults数据');
                        }).catch(error => {
                            console.log('发送未匹配结果消息失败:', error);
                        });
                    }, 50); // 50ms延迟确保popup DOM准备就绪
                    
                    sendResponse({ success: true });
                } else {
                    console.log('未匹配结果已过期，清理数据');
                    pendingNoMatchResults = null;
                    chrome.storage.local.remove('pendingNoMatchResults');
                    sendResponse({ success: false, message: 'no match results expired' });
                }
            } else {
                console.log('没有待显示的搜索结果');
                sendResponse({ success: false, message: 'no pending results' });
            }
        })();
        
        return true; // 保持消息通道开启
    } else if (request.type === 'clearSearchResults') {
        // 清理搜索结果
        console.log('清理搜索结果数据');
        pendingSearchResults = null;
        pendingNoMatchResults = null;
        chrome.storage.local.remove(['pendingSearchResults', 'pendingNoMatchResults']);
        sendResponse({ success: true });
        
        return true;
    } else if (request.type === 'cleanupExpiredDanmaku') {
        console.log('收到清理过期弹幕请求');
        // 异步执行清理，立即响应
        Promise.resolve().then(() => {
            cleanupExpiredDanmaku();
        });
        sendResponse({ success: true });
        return true;
    }
});