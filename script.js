// 全局变量和常量定义
const tabContainer = document.getElementById('tab-container');
const tabBar = document.getElementById('tab-bar');
let tabCounter = 0; // 标签计数器

// 版本检查相关配置
const VERSION_CHECK_URL = 'https://cdn.xy.siyuf.com/XYres/version.json'; // 远程版本文件URL
const UPDATE_BASE_URL = 'https://cdn.xy.siyuf.com/XYres/'; // 更新文件的基础URL
const LOCAL_VERSION_FILE = 'version.json'; // 本地版本文件

// 窗口尺寸限制
const MIN_WINDOW_WIDTH = 1300;
const MIN_WINDOW_HEIGHT = 720;

// 添加窗口尺寸限制函数
function enforceWindowSizeLimits() {
  const win = nw.Window.get();
  
  win.on('resize', (newWidth, newHeight) => {
    // 如果新的尺寸小于最小值，阻止调整
    if (newWidth < MIN_WINDOW_WIDTH || newHeight < MIN_WINDOW_HEIGHT) {
      // 阻止调整到小于最小值的尺寸
      win.resizeTo(
        Math.max(newWidth, MIN_WINDOW_WIDTH),
        Math.max(newHeight, MIN_WINDOW_HEIGHT)
      );
      
      // 阻止默认的调整行为
      return false;
    }
  });
  
  // 设置窗口最小尺寸
  win.setMinimumSize(MIN_WINDOW_WIDTH, MIN_WINDOW_HEIGHT);
}

//内网
// const httpurl = 'http://qn.3duan.cn:8001/?isPCWeiduan=true';
// const baseurl = 'http://qn.3duan.cn:8001/';

// const httpurl = 'https://cdn.xy.siyuf.com/XYres/index_waiwang.html?isPCWeiduan=true';
// const baseurl = 'https://cdn.xy.siyuf.com/XYres/';

//外网
// const httpurl = 'https://h5.nafeini.com/play/?g_token=iASIxeH4K9cwa3zRqtxHJQ%3D%3D';
// const baseurl = 'https://cdn.xy.siyuf.com/XYres/';

let httpurl = '';
let baseurl = '';

// URL 映射配置 - 自动推导本地路径
const urlMappings = [
  'libs/jquery-1.11.2.min.js',
  'setting.js',
  'libs/zlib.min.js',
  'libs/md5.js',
  'libs/ping.js',
  'libs/NoSleep.min.js',
  'logo.png',
  'favicon.ico',
  'LANversion.json',
  'libs/timeWorker.js',
  'res/data_FG/chargb.txt',
  'res/data_FG/chargb2.txt',
  'res/atlas/fg_mobile/m_alertPanel.atlas',
  'res/atlas/fg_mobile/m_alertPanel.png',
  'libs/eruda.js',
  'js/Login.js',
  'res/atlas/comp/MiniLoadingMain.atlas',
  // 'libs/wasm/workerNewAstar.js',
  'res/atlas/comp/MiniLoadingMain.png',
  'anis/MiniLoadingMain.ani',
  'res/atlas/anims//loginEff.atlas',
  'es/atlas/anims//loginEff.png',
  //'BGImg/FG/common/loginPage/mobile_bg.jpg',
  'libs/wasm/workerAstar.js',
  'libs/wasm/workerAstar.wasm',
  'libs/wasm/astar.js',
  'res/atlas/loginUI/FG_PreLogin.atlas',
  'res/atlas/loginUI/FG_PreLogin.png',
  //进入选服界面
  'engine/mp3/1000mp3/clickBtn.mp3',
  'res/atlas/fg/MainPage.atlas',
  'res/atlas/fg/MainPage.png',
  'BGImg/FG/common/loginPage/mobile_bg.jpg',
  //创角界面
  'engine/mp3/1000mp3/clickBtn.mp3',
  'js/Global.js',
  'js/SelectRole.js',
  'res/atlas/fg_mobile/m_loginUI.atlas',
  'res/atlas/fg_mobile/m_loginUI.png',
  'res/atlas/fg_mobile/m_loginModeUI.atlas',
  'res/atlas/fg_mobile/m_loginModeUI.png',
  'res/atlas/anims/selectRoleEff/selectRoleEff3.atlas',
  'res/atlas/anims/selectRoleEff//selectRoleEff1.atlas',
  'res/atlas/anims/selectRoleEff//selectRoleEff2.atlas',
  'res/atlas/anims/selectRoleEff//selectRoleEff4.atlas',
  'res/atlas/anims/selectRoleEff/selectRoleEff3.png',
  'res/atlas/anims/selectRoleEff//selectRoleEff1.png',
  'res/atlas/anims/selectRoleEff//selectRoleEff2.png',
  'res/atlas/anims/selectRoleEff//selectRoleEff4.png',
  'fg_mobile/m_loginModeUI/mobile_bg.jpg',
  'engine/res/image/createRole/0/',
  'engine/res/image/createRole/1/',
  //开始进入游戏，读loading条
  'res/atlas/mobile/fgm_loadingUI.atlas',
  'res/atlas/mobile/fgm_loadingUI.png',
  'BGImg/FG/common/loadingPage/',
  'res/atlas/anims/LoadingEff/Loading4Eff.atlas',
  'res/atlas/anims/LoadingEff/Loading4Eff.png',
  'res/atlas/anims/LoadingEff/Loading5Eff.atlas',
  'res/atlas/anims/LoadingEff/Loading5Eff.png',
  'res/atlas/anims/mobile/PackageEff.atlas',
  'res/atlas/anims/mobile/PackageEff.png',
  'res/atlas/anims/TaskCompoleteEff.atlas',
  'res/atlas/anims/TaskCompoleteEff.png',
  'res/atlas/fg_mobile/m_common/btn.atlas',
  'res/atlas/fg_mobile/m_common/btn.png',
  'res/atlas/fg_mobile/m_common/view.atlas',
  'res/atlas/fg_mobile/m_common/view.png',
  'res/atlas/fg_mobile/m_common/img.atlas',
  'res/atlas/fg_mobile/m_common/img.png',
  '',
  '',
  '',
  '',
  '',
  '',
];

// 1. 渲染进度条和日志区到页面
(function renderUpdateProgressUI() {
  if (!document.getElementById('progress-container')) {
    const container = document.createElement('div');
    container.id = 'progress-container';
    container.style = 'width:60vw;max-width:600px;margin:40px auto 0;display:none;z-index:99999;position:relative;';
    container.innerHTML = `
      <div style="background:#222;border-radius:8px;overflow:hidden;">
        <div id="progress-bar" style="height:24px;width:0;background:#4caf50;transition:width 0.3s;"></div>
      </div>
      <div id="progress-text" style="color:#fff;margin-top:8px;font-family:monospace;"></div>
      <div id="progress-log" style="color:#0f0;font-size:13px;font-family:monospace;white-space:pre-line;max-height:180px;overflow:auto;margin-top:8px;background:rgba(0,0,0,0.7);padding:8px;border-radius:4px;"></div>
    `;
    document.body.appendChild(container);
  }
})();

// 2. 监听updater.js派发的进度事件，更新进度条、文本和日志
window.addEventListener('update-log', function(e) {
  const { msg, percent } = e.detail;
  const container = document.getElementById('progress-container');
  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');
  const logDiv = document.getElementById('progress-log');
  if (container) container.style.display = 'block';
  if (bar && typeof percent === 'number') bar.style.width = percent + '%';
  if (text && msg) text.innerText = msg;
  if (logDiv && msg) {
    logDiv.innerText += msg + '\n';
    logDiv.scrollTop = logDiv.scrollHeight;
  }
});

// 远程获取h5url.json并赋值httpurl和baseurl
async function fetchRemoteUrlsAndInit() {
  try {
    const resp = await fetch('http://qn.3duan.cn:8001/weiduan915/h5url.json?_t=' + Date.now());
    const data = await resp.json();
    httpurl = data.httpurl;
    baseurl = data.baseurl;
    // 启动主页面初始化流程
    waitForUpdateAndInit();
  } catch (err) {
    console.error('获取h5url.json失败:', err);
    httpurl = '';
    baseurl = '';
  }
}

// 3. 等待updater.js完成后再初始化主页面
function waitForUpdateAndInit() {
  if (window.updateDone && httpurl) {
    setTimeout(() => {
      const container = document.getElementById('progress-container');
      if (container) container.style.display = 'none';
    }, 800);
    createInitialTab(httpurl);
    initConsoleKey();
  } else {
    setTimeout(waitForUpdateAndInit, 200);
  }
}

// 启动时先拉取远程url配置
fetchRemoteUrlsAndInit();

// 为了防止右键菜单中的开发者工具选项，我们也禁用右键菜单
document.addEventListener('contextmenu', (e) => {
  e.preventDefault();
  return false;
}, true);

//初始化控制台按键打开代码
function initConsoleKey() {
  const win = nw.Window.get();
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F12') {
        e.preventDefault();
        return false;
      }
      if (e.ctrlKey && e.key === '8') {
        setTimeout(() => {
          win.showDevTools();
        }, 100);
      }
    }, true);
    enforceWindowSizeLimits();
}
// 保证多开按钮始终在最右侧
function ensureNewTabButtonAtEnd() {
  const tabBar = document.getElementById('tab-bar');
  const newTabButton = tabBar.querySelector('.new-tab-button');
  if (newTabButton) {
    tabBar.appendChild(newTabButton);
  }
}

// 修改新标签页创建函数
function newTab() {
  // 获取当前活动的webview的URL
  const activeWebview = tabContainer.querySelector('webview[active]');
  const currentUrl = activeWebview ? activeWebview.src : httpurl;

  // 移除其他标签的激活状态
  if (activeWebview) {
    activeWebview.removeAttribute('active');
  }
  const activeTabs = tabBar.querySelectorAll('.tab.active');
  activeTabs.forEach(tab => tab.classList.remove('active'));

  // 创建新标签
  tabCounter++;
  const tabId = `tab-${tabCounter}`;

  // 创建 webview，使用当前活动标签的URL
  const webview = createWebView();
  webview.setAttribute('src', currentUrl);
  webview.setAttribute('id', tabId);
  webview.setAttribute('active', 'true');
  tabContainer.appendChild(webview);

  // 创建标签
  const tab = createTab(tabId, `侠客先锋`);
  tab.classList.add('active');
  tabBar.appendChild(tab);
  
  // 更新显示状态
  const webviews = tabContainer.querySelectorAll('webview');
  webviews.forEach(webview => {
    webview.style.display = webview.hasAttribute('active') ? 'block' : 'none';
  });

  ensureNewTabButtonAtEnd();
}

// 激活标签
function activateTab(tabId) {
  // 移除其他标签的激活状态
  const webviews = tabContainer.querySelectorAll('webview');
  webviews.forEach(webview => webview.removeAttribute('active'));
  const tabs = tabBar.querySelectorAll('.tab');
  tabs.forEach(tab => tab.classList.remove('active'));

  // 激活选中的标签
  const webview = document.getElementById(tabId);
  const tab = tabBar.querySelector(`[data-tab-id="${tabId}"]`);
  if (webview && tab) {
    webview.setAttribute('active', 'true');
    tab.classList.add('active');
    // 直接设置显示状态
    const webviews = tabContainer.querySelectorAll('webview');
    webviews.forEach(webview => {
      webview.style.display = webview.hasAttribute('active') ? 'block' : 'none';
    });
  }
}

// 关闭标签
function closeTab(tabId) {
  const webview = document.getElementById(tabId);
  const tab = tabBar.querySelector(`[data-tab-id="${tabId}"]`);
  
  if (webview && tab) {
    // 如果关闭的是当前激活的标签，选择新的标签激活
    if (webview.hasAttribute('active')) {
      // 获取所有非"新建标签"按钮的标签
      const allTabs = Array.from(tabBar.querySelectorAll('.tab')).filter(t => 
        !t.classList.contains('new-tab-button')
      );
      
      // 获取当前标签的索引
      const currentIndex = allTabs.indexOf(tab);
      
      // 优先选择后一个标签，如果没有则选择最后一个标签
      if (currentIndex < allTabs.length - 1) {
        // 有后续标签，选择下一个
        activateTab(allTabs[currentIndex + 1].getAttribute('data-tab-id'));
      } else if (currentIndex > 0) {
        // 没有后续标签，选择最后一个（当前标签的前一个）
        activateTab(allTabs[currentIndex - 1].getAttribute('data-tab-id'));
      }
    }
    
    webview.remove();
    tab.remove();
    ensureNewTabButtonAtEnd();
  }
}

// 窗口控制函数
function minimizeWindow() {
  const win = nw.Window.get();
  win.minimize();
  
  // 通知所有webview窗口被最小化
  const webviews = document.querySelectorAll('webview');
  webviews.forEach(webview => {
    sendToWebview(webview, {
      type: 'windowState',
      state: 'minimized'
    });
  });
}

function maximizeWindow() {
  const win = nw.Window.get();
  if (win.isMaximized) {
    win.restore();
    win.isMaximized = false;
  } else {
    win.maximize();
    win.isMaximized = true;
  }
  
  // 通知所有webview窗口状态改变
  const webviews = document.querySelectorAll('webview');
  webviews.forEach(webview => {
    sendToWebview(webview, {
      type: 'windowState',
      state: win.isMaximized ? 'maximized' : 'restored'
    });
  });
}

function closeWindow() {
  nw.Window.get().close();
}

// 添加菜单控制函数
function toggleMenu() {
  const sideControls = document.querySelector('.side-controls');
  sideControls.classList.toggle('hidden');

  // 如果菜单被打开，添加点击事件监听器
  if (!sideControls.classList.contains('hidden')) {
    // 使用 setTimeout 确保当前的点击事件不会立即触发隐藏
    setTimeout(() => {
      const hideMenu = (e) => {
        // 如果点击的是菜单按钮，不处理
        if (e.target.classList.contains('menu-toggle')) {
          return;
        }
        
        // 隐藏菜单
        sideControls.classList.add('hidden');
        // 移除点击事件监听器
        document.removeEventListener('click', hideMenu);
      };
      
      document.addEventListener('click', hideMenu);
    }, 0);
  }
}

// 修改 ResizeObserver 的处理逻辑
const resizeObserver = new ResizeObserver(entries => {
  for (let entry of entries) {
    if (entry.target.classList.contains('toolbar')) {
      const toolbarHeight = entry.target.offsetHeight;
      
      // 更新侧边控制栏位置
      const sideControls = document.querySelector('.side-controls');
      if (sideControls) {
        sideControls.style.bottom = `${toolbarHeight + 3}px`;
      }
      
      // 更新 webview 容器高度
      document.documentElement.style.setProperty('--toolbar-height', `${toolbarHeight}px`);
      
      // 强制触发 webview 容器重新计算高度
      const tabContainer = document.getElementById('tab-container');
      if (tabContainer) {
        tabContainer.style.height = `calc(100vh - ${toolbarHeight}px)`;
      }
    }
  }
});

// 修改创建标签的函数
function createTab(tabId, title) {
  const tab = document.createElement('div');
  tab.className = 'tab';
  tab.setAttribute('data-tab-id', tabId);
  
  const tabTitle = document.createElement('span');
  tabTitle.className = 'tab-title';
  tabTitle.textContent = '侠客先锋';
  
  const closeBtn = document.createElement('button');
  closeBtn.className = 'tab-close';
  closeBtn.innerHTML = '×';
  closeBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    closeTab(tabId);
  });
  
  tab.appendChild(tabTitle);
  tab.appendChild(closeBtn);
  
  // 添加标签点击事件
  tab.addEventListener('click', () => {
    activateTab(tabId);
  });
  
  return tab;
}

// 添加清除缓存的函数
function clearCache() {
  const win = nw.Window.get();
  
  // 获取所有webview
  const webviews = document.querySelectorAll('webview');
  
  // 清除每个webview的缓存
  webviews.forEach(webview => {
    // 清除localStorage
    webview.executeScript({
      code: `
        (function() {
          localStorage.clear();
          console.log('✅ localStorage已清除');
        })();
      `
    });
    
    // 清除sessionStorage
    webview.executeScript({
      code: `
        (function() {
          sessionStorage.clear();
          console.log('✅ sessionStorage已清除');
        })();
      `
    });
    
    // 清除cookies
    webview.executeScript({
      code: `
        (function() {
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });
          console.log('✅ Cookies已清除');
        })();
      `
    });
  });
  
  // 清除NW.js的缓存
  const cache = nw.App.cache;
  if (cache) {
    cache.clear();
    console.log('✅ NW.js缓存已清除');
  }
  
  // 创建提示框
  const toast = document.createElement('div');
  toast.style.cssText = `
    position: fixed;
    bottom: 20px;
    right: 20px;
    background-color: rgba(0, 0, 0, 0.8);
    color: white;
    padding: 12px 24px;
    border-radius: 4px;
    font-size: 14px;
    z-index: 9999;
    transition: opacity 0.3s ease-in-out;
  `;
  toast.textContent = '所有缓存已清除完成';
  document.body.appendChild(toast);
  
  // 5秒后自动消失
  setTimeout(() => {
    toast.style.opacity = '0';
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 300);
  }, 5000);
  
  // 重新加载当前页面
  const activeWebview = document.querySelector('webview[active]');
  if (activeWebview) {
    activeWebview.reload();
  }
}

// 重新加载当前页面
function reload(){
  const activeWebview = document.querySelector('webview[active]');
  if (activeWebview) {
    activeWebview.reload();
  }
}

// 添加打开游戏官网的函数
function openGameWebsite() {
  // 使用系统默认浏览器打开链接
  nw.Shell.openExternal('https://baidu.com');
}

// 在初始化时添加多开按钮
window.addEventListener('load', () => {
  const tabBar = document.getElementById('tab-bar');
  const button = document.createElement('button');
  button.className = 'new-tab-button';
  button.onclick = newTab;
  tabBar.appendChild(button);
});

// 添加一个函数来转换远程URL为本地路径
function remoteUrlToLocalPath(url) {
  // 移除 baseurl
  let localPath = url.replace(baseurl, '');
  
  // 移除查询参数
  localPath = localPath.split('?')[0];
  
  // 添加assets/game前缀
  return `assets/game/${localPath}`;
}

function createWebView() {
  const webview = document.createElement('webview');
  
  // 设置持久化缓存分区
  webview.setAttribute('partition', 'persist:gameCache');
  
  // 通过属性设置userAgent
  const defaultUserAgent = navigator.userAgent;
  const customUserAgent = `${defaultUserAgent} Weiduan/1.0.0 (PC)`;
  webview.setAttribute('useragent', customUserAgent);
  
  webview.addEventListener('contentload', () => {
    console.log('✅ Webview准备就绪');
    
    // 只在第一次初始化时设置请求监听
    if (!webview._requestListenerInitialized) {
      const request = webview.request;
      
      request.onBeforeRequest.addListener(
        async (details) => {
          const url = details.url;
          const cleanUrl = url.split('?')[0];
          
          // 如果是主URL，不进行拦截
          if (url.startsWith(httpurl)) {
            return { cancel: false };
          }
          
          // 检查是否是需要拦截的URL
          if (urlMappings.some(mapping => {
            const relativePath = cleanUrl.replace(baseurl, '');
            // 如果mapping以/结尾，说明是目录，使用startsWith匹配
            // 否则是具体文件，使用完全匹配
            return mapping.endsWith('/') ? 
              relativePath.startsWith(mapping) : 
              relativePath === mapping;
          })) {
            const localPath = remoteUrlToLocalPath(cleanUrl);
            const absolutePath = require('path').join(nw.App.startPath, localPath);
            
            console.log('⌛ 检查资源:', {
              原始URL: url,
              本地路径: absolutePath
            });

            try {
              // 从URL中获取版本号参数
              const urlParams = new URLSearchParams(url.split('?')[1]);
              const remoteVersion = urlParams.get('v') || '';

              const fs = require('fs');
              let fileData;

              // 检查本地文件是否存在
              if (fs.existsSync(absolutePath)) {
                // 读取本地文件版本号（假设存储在同目录下的.version文件中）
                const versionPath = absolutePath + '.version';
                let localVersion = '';
                
                if (fs.existsSync(versionPath)) {
                  localVersion = fs.readFileSync(versionPath, 'utf8').trim();
                }

                // 版本号不匹配，需要更新
                if (remoteVersion && localVersion !== remoteVersion) {
                  console.log('⚠️ 版本不匹配，从远程更新:', {
                    本地版本: localVersion,
                    远程版本: remoteVersion
                  });
                  
                  // 从远程获取新版本
                  const response = await fetch(url);
                  fileData = Buffer.from(await response.arrayBuffer());
                  
                  // 保存新文件
                  fs.writeFileSync(absolutePath, fileData);
                  // 保存版本号
                  fs.writeFileSync(versionPath, remoteVersion);
                } else {
                  // 使用本地文件
                  fileData = fs.readFileSync(absolutePath);
                }
              } else {
                // 本地文件不存在，从远程获取
                console.log('⚠️ 本地文件不存在，从远程获取');
                
                // 确保目录存在
                const dirname = require('path').dirname(absolutePath);
                if (!fs.existsSync(dirname)) {
                  fs.mkdirSync(dirname, { recursive: true });
                }
                
                // 从远程获取文件
                const response = await fetch(url);
                fileData = Buffer.from(await response.arrayBuffer());
                
                // 保存文件和版本号
                fs.writeFileSync(absolutePath, fileData);
                if (remoteVersion) {
                  fs.writeFileSync(absolutePath + '.version', remoteVersion);
                }
              }
              
              // 获取文件MIME类型
              const mime = require('mime-types');
              const mimeType = mime.lookup(absolutePath) || 'application/octet-stream';
              
              // 转换为base64
              const base64Data = fileData.toString('base64');
              const dataUrl = `data:${mimeType};base64,${base64Data}`;
              
              console.log('✅ 资源处理完成:', {
                路径: absolutePath,
                大小: fileData.length,
                类型: mimeType
              });

              return { redirectUrl: dataUrl };
              
            } catch (err) {
              console.error('❌ 资源处理错误:', err);
              return { cancel: false };
            }
          }
          return { cancel: false };
        },
        { urls: ['<all_urls>'] },
        ['blocking']
      );
      
      webview._requestListenerInitialized = true;
    }
  });

  return webview;
}

// 创建初始标签页函数
function createInitialTab(url) {
  if(tabCounter > 0){
    return;
  }
  tabCounter++;
  console.log('创建初始标签页:', url);
  const tabId = `tab-${tabCounter}`;
  // 创建 <webview>
  const webview = createWebView();
  webview.setAttribute('src', url);
  webview.setAttribute('id', tabId);
  webview.setAttribute('active', 'true');
  tabContainer.appendChild(webview);
  // 创建标签
  const tab = document.createElement('div');
  tab.className = 'tab active';
  tab.setAttribute('data-tab-id', tabId);
  tab.innerHTML = `侠客先锋 <span class="tab-close">×</span>`;
  // 添加标签点击事件
  tab.addEventListener('click', (e) => {
    if (!e.target.classList.contains('tab-close')) {
      activateTab(tabId);
    }
  });
  // 添加关闭按钮事件
  const closeBtn = tab.querySelector('.tab-close');
  closeBtn.addEventListener('click', () => closeTab(tabId));
  tabBar.appendChild(tab);
  ensureNewTabButtonAtEnd();
}



