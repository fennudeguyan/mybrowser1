const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const https = require('https');
const extract = require('extract-zip');

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Download failed with status ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      file.on('finish', () => {
        file.close(resolve);
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => reject(err));
    });
  });
}

async function verifyZip(zipPath) {
  return new Promise((resolve) => {
    fs.access(zipPath, fs.constants.R_OK, (err) => {
      if (err) {
        console.error('ZIP file not accessible');
        resolve(false);
        return;
      }
      
      const stats = fs.statSync(zipPath);
      if (stats.size < 1000000) { // 小于1MB肯定是损坏的
        console.error('ZIP file too small, likely incomplete');
        resolve(false);
      } else {
        resolve(true);
      }
    });
  });
}

async function buildApp() {
  const NW_VERSION = '0.77.0';
  const PLATFORM = 'osx64';
  const APP_NAME = 'MyApp';
  const NW_URL = `https://dl.nwjs.io/v${NW_VERSION}/nwjs-v${NW_VERSION}-${PLATFORM}.zip`;
  const ZIP_PATH = 'nwjs.zip';
  
  try {
    console.log('Cleaning old builds...');
    execSync('rm -rf dist nw-cache', { stdio: 'inherit' });
    fs.mkdirSync('dist', { recursive: true });

    console.log(`Downloading NW.js ${NW_VERSION}...`);
    
    // 尝试最多3次下载
    let downloadSuccess = false;
    for (let i = 0; i < 3; i++) {
      try {
        await downloadFile(NW_URL, ZIP_PATH);
        
        if (await verifyZip(ZIP_PATH)) {
          downloadSuccess = true;
          break;
        } else {
          console.log(`Download attempt ${i+1} failed, retrying...`);
          fs.unlinkSync(ZIP_PATH);
        }
      } catch (err) {
        console.log(`Download attempt ${i+1} failed: ${err.message}`);
      }
    }
    
    if (!downloadSuccess) {
      throw new Error('Failed to download NW.js after 3 attempts');
    }

    console.log('Extracting NW.js...');
    await extract(ZIP_PATH, { dir: 'nw-cache' });
    fs.unlinkSync(ZIP_PATH);

    console.log('Preparing application...');
    const runtimePath = `nw-cache/nwjs-v${NW_VERSION}-${PLATFORM}/nwjs.app`;
    const appPath = `dist/${APP_NAME}.app`;

    execSync(`cp -R "${runtimePath}" "${appPath}"`, { stdio: 'inherit' });

    console.log('Packaging app files...');
    execSync(`zip -r "${appPath}/Contents/Resources/app.nw" package.json index.html`, { 
      stdio: 'inherit' 
    });

    console.log('Creating DMG...');
    execSync(`
      hdiutil create \
      -volname "${APP_NAME}" \
      -srcfolder "${appPath}" \
      -ov -format UDZO \
      "dist/${APP_NAME}.dmg"
    `, { stdio: 'inherit' });

    console.log('Build completed successfully!');
    console.log(`Application: dist/${APP_NAME}.app`);
    console.log(`DMG package: dist/${APP_NAME}.dmg`);
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

buildApp();