// 版本检查相关配置
const VERSION_CHECK_URL2 = 'http://qn.3duan.cn:8001/weiduan915/pcversion.json'; // 远程版本文件URL
const UPDATE_BASE_URL2 = 'http://qn.3duan.cn:8001/weiduan915/'; // 更新文件的基础URL
const LOCAL_VERSION_FILE2 = 'weiduan915/pcversion.json'; // 本地版本文件

// 事件派发函数
function sendUpdateLog(msg, percent) {
  if (typeof window !== 'undefined' && window.dispatchEvent) {
    window.dispatchEvent(new CustomEvent('update-log', {
      detail: { msg, percent }
    }));
  }
}

window.updateDone = false;

(async function() {
  sendUpdateLog('【更新】开始版本检查...', 5);
  try {
    const fs = require('fs');
    const path = require('path');
    const localVersionPath = path.join(nw.App.startPath, LOCAL_VERSION_FILE2);
    sendUpdateLog('[更新] 本地版本文件路径: ' + localVersionPath, 10);
    let localVersion = {};
    if (fs.existsSync(localVersionPath)) {
      localVersion = JSON.parse(fs.readFileSync(localVersionPath, 'utf8'));
      sendUpdateLog('[更新] 读取到本地版本: ' + JSON.stringify(localVersion), 15);
    } else {
      sendUpdateLog('[更新] 本地版本文件不存在，将视为首次安装', 15);
    }
    sendUpdateLog('[更新] 开始请求远程版本: ' + VERSION_CHECK_URL2, 20);
    const urlWithNoCache = VERSION_CHECK_URL2 + '?_t=' + Date.now();
    const response = await fetch(urlWithNoCache);
    const remoteVersion = await response.json();
    sendUpdateLog('[更新] 获取到远程版本: ' + JSON.stringify(remoteVersion), 25);
    const filesToUpdate = [];
    for (const [file, version] of Object.entries(remoteVersion.files)) {
      if (!localVersion.files || localVersion.files[file] !== version) {
        filesToUpdate.push(file);
        sendUpdateLog(`[更新] 检测到需更新文件: ${file} 本地:${localVersion.files ? localVersion.files[file] : '无'} 远程:${version}`, 30);
      }
    }
    if (filesToUpdate.length > 0) {
      sendUpdateLog('[更新] 发现新版本，需要更新文件: ' + filesToUpdate.join(','), 35);
      const totalFiles = filesToUpdate.length;
      for (let i = 0; i < filesToUpdate.length; i++) {
        const file = filesToUpdate[i];
        try {
          const fileUrl = UPDATE_BASE_URL2 + file + '?_t=' + Date.now();
          sendUpdateLog(`[更新] 开始下载: ${fileUrl}`, 40 + Math.floor((i / totalFiles) * 40));
          const fileResponse = await fetch(fileUrl);
          const fileContent = await fileResponse.text();
          sendUpdateLog(`[更新] 下载完成: ${file}，准备写入本地`, 60 + Math.floor((i / totalFiles) * 30));
          const filePath = path.join(nw.App.startPath, file);
          fs.writeFileSync(filePath, fileContent);
          sendUpdateLog(`[更新] 写入本地完成: ${filePath}`, 70 + Math.floor((i / totalFiles) * 20));
        } catch (err) {
          sendUpdateLog(`[更新] 更新文件失败: ${file} ${err.message}`, 80);
        }
      }
      fs.writeFileSync(localVersionPath, JSON.stringify(remoteVersion, null, 2));
      sendUpdateLog('[更新] 本地版本文件已更新: ' + localVersionPath, 95);
      sendUpdateLog('[更新] 所有文件更新完成，3秒后自动刷新页面...', 100);
      setTimeout(() => {
        sendUpdateLog('[更新] 即将刷新页面...', 100);
        nw.Window.get().reload();
      }, 3000);
    } else {
      sendUpdateLog('[更新] 当前已是最新版本，无需更新', 100);
      setTimeout(() => {
        window.updateDone = true;
        sendUpdateLog('[更新] 即将进入主页面...', 100);
      }, 1000);
    }
  } catch (err) {
    sendUpdateLog('[更新] 版本检查失败: ' + err.message, 100);
    setTimeout(() => {
      window.updateDone = true;
      sendUpdateLog('[更新] 即将进入主页面...', 100);
    }, 1000);
  }
})();


// 监听updater.js派发的进度事件，更新进度条和文本
window.addEventListener('update-log', function(e) {
  const { msg, percent } = e.detail;
  const container = document.getElementById('progress-container');
  const bar = document.getElementById('progress-bar');
  const text = document.getElementById('progress-text');
  if (container) container.style.display = 'block';
  if (bar && typeof percent === 'number') bar.style.width = percent + '%';
  if (text && msg) text.innerText = msg;
});

// 等待updater.js完成后再初始化主页面
function waitForUpdateAndInit() {
  if (window.updateDone) {
    // 隐藏进度条
    setTimeout(() => {
      const container = document.getElementById('progress-container');
      if (container) container.style.display = 'none';
    }, 800);
    // 初始化主页面
    createInitialTab(httpurl);
    // 其它初始化...
  } else {
    setTimeout(waitForUpdateAndInit, 200);
  }
}
waitForUpdateAndInit(); 