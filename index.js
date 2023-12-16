const fs = require('node:fs')
const path = require('path')
const { makeIconDir, getFirstFileNameOfSortedDir, copyFile } = require('./lib/fileOperations.js')
const { copyJpgAsPng, convertImgToSquare, createResizedSquareImages } = require('./lib/imageOperations.js')
const { createIcoFromPngImgs, updateIconResourceOfDesktopIni } = require('./lib/iconOperations.js')
const { execCommand } = require('./lib/commandOperations.js')

/**
 * @param {String} dirPath
 */
function convertRelativeToAbsolutePath(dirPath) {
  if (dirPath.startsWith('./')) dirPath = dirPath.replace('./', '')
  if (!path.isAbsolute(dirPath)) dirPath = path.resolve(dirPath)
  return dirPath
}

async function processIconTargetFile(dirPath, iconTargetFileName, iconDirPath) {
  const iconTargetFilePath = `${dirPath}/${iconTargetFileName}`;
  let copiedIconTargetFilePath;

  if (/\.png$/i.test(iconTargetFileName)) {
    copiedIconTargetFilePath = copyFile(iconTargetFilePath, `${iconDirPath}\\${iconTargetFileName}`);
  } else {
    copiedIconTargetFilePath = await copyJpgAsPng(iconTargetFilePath, iconDirPath);
  }

  await convertImgToSquare(copiedIconTargetFilePath);
  return copiedIconTargetFilePath;
}

async function createIcon(dirPath, copiedIconTargetFilePath, iconDirPath) {
  const resizedPngPathArray = await createResizedSquareImages(copiedIconTargetFilePath, iconDirPath);
  const iconPath = iconDirPath + '\\' + 'icon.ico';
  await createIcoFromPngImgs(resizedPngPathArray, iconPath);
  return { iconPath, resizedPngPathArray };
}

async function updateFolderIcon(dirPath, desktopIniPath, iconPath) {
  await execCommand(`attrib -r "${dirPath}"`);
  await execCommand(`attrib -s -h "${desktopIniPath}"`);
  updateIconResourceOfDesktopIni(desktopIniPath, iconPath);
  await execCommand(`attrib -s -h "${dirPath}"`);
  await execCommand(`attrib +s +h "${desktopIniPath}"`);
  await execCommand(`attrib +r "${dirPath}"`); //Required to display icons
}

async function setFolderIcon(dirPath) {
  dirPath = convertRelativeToAbsolutePath(dirPath);

  const iconTargetFileName = getFirstFileNameOfSortedDir(dirPath);
  if (!iconTargetFileName) throw new Error(`${dirPath} has no image file.`);
  const iconDirPath = makeIconDir(dirPath);

  const copiedIconTargetFilePath = await processIconTargetFile(dirPath, iconTargetFileName, iconDirPath);
  const { iconPath, resizedPngPathArray } = await createIcon(dirPath, copiedIconTargetFilePath, iconDirPath);

  const desktopIniPath = `${dirPath}/desktop.ini`;
  await updateFolderIcon(dirPath, desktopIniPath, iconPath);

  fs.rmSync(copiedIconTargetFilePath);
  resizedPngPathArray.forEach(pngPath => fs.rmSync(pngPath));
}

async function main() {
  const dirPaths = process.argv.slice(2)
  for (const dirPath of dirPaths) {
    try {
      if (fs.statSync(dirPath).isDirectory()) {
        console.log(`start setFolderIcon for ${dirPath}`)
        await setFolderIcon(dirPath)
        console.log(`end setFolderIcon for ${dirPath}`)
      }
    } catch (error) {
      console.error(`Failed to process directory ${dirPath}\nError: ${error.message}`)
    }
  }
}

main()