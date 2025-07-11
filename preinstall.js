const fs = require('fs');
const path = require('path');
const fetch = require('node-fetch');

async function installNWjs() {
  const version = '0.76.1';
  const url = `https://dl.nwjs.io/v${version}/nwjs-v${version}-osx-x64.zip`;
  const destDir = path.join('nw-cache', version);
  
  try {
    console.log(`Downloading NW.js ${version} from ${url}`);
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Download failed: ${response.statusText}`);
    
    fs.mkdirSync(destDir, { recursive: true });
    const destPath = path.join(destDir, `nwjs-v${version}-osx-x64.zip`);
    const fileStream = fs.createWriteStream(destPath);
    await new Promise((resolve, reject) => {
      response.body.pipe(fileStream);
      response.body.on("error", reject);
      fileStream.on("finish", resolve);
    });
    
    console.log('Download completed successfully');
  } catch (error) {
    console.error('Installation failed:', error);
    process.exit(1);
  }
}

installNWjs();