const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { promisify } = require('util');
const stream = require('stream');
const extract = require('extract-zip');

const pipeline = promisify(stream.pipeline);

async function downloadNWjs() {
  const version = '0.77.0';
  const url = `https://dl.nwjs.io/v${version}/nwjs-v${version}-osx-x64.zip`;
  const cacheDir = path.join(__dirname, '../nw-cache', version);
  const zipPath = path.join(cacheDir, 'nwjs.zip');
  const extractPath = path.join(cacheDir, 'extracted');

  try {
    console.log(`Downloading NW.js ${version} from ${url}`);
    
    // 清理旧缓存
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
    }
    
    // 创建缓存目录
    fs.mkdirSync(cacheDir, { recursive: true });

    // 下载文件
    const response = await axios({
      url,
      method: 'GET',
      responseType: 'stream',
      timeout: 60000
    });

    await pipeline(
      response.data,
      fs.createWriteStream(zipPath)
    );

    console.log('Extracting NW.js...');
    
    // 解压文件
    await extract(zipPath, { 
      dir: extractPath,
      onEntry: (entry) => {
        const destPath = path.join(extractPath, entry.fileName);
        if (fs.existsSync(destPath)) {
          fs.rmSync(destPath, { force: true });
        }
      }
    });

    console.log('NW.js downloaded and extracted successfully');
  } catch (error) {
    console.error('Download failed:', error.message);
    process.exit(1);
  }
}

downloadNWjs();