const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const extract = require('extract-zip');
const AdmZip = require('adm-zip');

// 配置参数
const NW_VERSION = '0.77.0';
const PLATFORM = 'osx64';
const OUTPUT_DIR = path.join(__dirname, '../dist');
const CACHE_DIR = path.join(__dirname, '../nw-cache');

async function buildApp() {
  try {
    // 1. 清理旧构建
    console.log('Cleaning old builds...');
    execSync('npm run clean');
    
    // 2. 下载NW.js运行时
    console.log('Downloading NW.js runtime...');
    const nwUrl = `https://dl.nwjs.io/v${NW_VERSION}/nwjs-v${NW_VERSION}-${PLATFORM}.zip`;
    const zipPath = path.join(CACHE_DIR, `nwjs-v${NW_VERSION}-${PLATFORM}.zip`);
    const extractPath = path.join(CACHE_DIR, 'runtime');
    
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }

    execSync(`curl -L ${nwUrl} -o ${zipPath}`);
    
    // 3. 解压运行时
    console.log('Extracting runtime...');
    await extract(zipPath, { dir: extractPath });
    
    // 4. 准备应用文件
    console.log('Preparing application...');
    const appName = 'my-app';
    const appPath = path.join(extractPath, `nwjs-v${NW_VERSION}-${PLATFORM}`, 'nwjs.app');
    const contentsPath = path.join(appPath, 'Contents');
    const resourcesPath = path.join(contentsPath, 'Resources');
    
    // 5. 复制项目文件
    fs.cpSync(__dirname + '/..', resourcesPath + '/app.nw', {
      recursive: true,
      filter: (src) => !src.includes('node_modules') && !src.includes('dist')
    });
    
    // 6. 修改Info.plist
    const infoPlistPath = path.join(contentsPath, 'Info.plist');
    let infoPlist = fs.readFileSync(infoPlistPath, 'utf8');
    infoPlist = infoPlist.replace(/<key>CFBundleName<\/key>\s*<string>.*<\/string>/, 
      `<key>CFBundleName</key><string>${appName}</string>`);
    fs.writeFileSync(infoPlistPath, infoPlist);
    
    // 7. 创建输出目录
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // 8. 打包应用
    console.log('Creating application package...');
    const zip = new AdmZip();
    zip.addLocalFolder(appPath);
    zip.writeZip(path.join(OUTPUT_DIR, `${appName}-mac.zip`));
    
    console.log('Build completed successfully!');
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();