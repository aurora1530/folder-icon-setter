import fs from 'fs';
import path from 'path';
import {
  makeIconDir,
  getFirstFileNameOfSortedDir,
  copyFile,
} from './components/fileOperations';
import {
  copyJpgAsPng,
  convertImgToSquare,
  createResizedSquareImages,
} from './components/imageOperations';
import {
  createIcoFromPngImgs,
  updateIconResourceOfDesktopIni,
} from './components/iconOperations';
import { execCommand } from './components/commandOperations';

function convertRelativeToAbsolutePath(dirPath: string): string {
  if (dirPath.startsWith('./')) dirPath = dirPath.replace('./', '');
  if (!path.isAbsolute(dirPath)) dirPath = path.resolve(dirPath);
  return dirPath;
}

async function createCopiedIconTargetImg(
  dirPath: string,
  iconTargetFileName: string,
  iconDirPath: string
): Promise<string> {
  const iconTargetFilePath = `${dirPath}/${iconTargetFileName}`;
  let copiedIconTargetFilePath;

  if (/\.png$/i.test(iconTargetFileName)) {
    copiedIconTargetFilePath = copyFile(
      iconTargetFilePath,
      `${iconDirPath}\\${iconTargetFileName}`
    );
  } else {
    copiedIconTargetFilePath = await copyJpgAsPng(iconTargetFilePath, iconDirPath);
  }

  await convertImgToSquare(copiedIconTargetFilePath);
  return copiedIconTargetFilePath;
}

async function createIcon(
  copiedIconTargetFilePath: string,
  iconDirPath: string
): Promise<{ iconPath: string; resizedPngPathArray: string[] }> {
  const resizedPngPathArray = await createResizedSquareImages(
    copiedIconTargetFilePath,
    iconDirPath
  );
  const iconPath = iconDirPath + '\\' + 'icon.ico';
  await createIcoFromPngImgs(resizedPngPathArray, iconPath);
  return { iconPath, resizedPngPathArray };
}

async function updateFolderIcon(
  dirPath: string,
  desktopIniPath: string,
  iconPath: string
): Promise<void> {
  await execCommand(`attrib -r "${dirPath}"`);
  await execCommand(`attrib -s -h "${desktopIniPath}"`);
  updateIconResourceOfDesktopIni(desktopIniPath, iconPath);
  await execCommand(`attrib -s -h "${dirPath}"`);
  await execCommand(`attrib +s +h "${desktopIniPath}"`);
  await execCommand(`attrib +r "${dirPath}"`); //Required to display icons
}

async function setFolderIcon(dirPath: string): Promise<void> {
  dirPath = convertRelativeToAbsolutePath(dirPath);

  const iconTargetFileName = getFirstFileNameOfSortedDir(dirPath);
  if (!iconTargetFileName) throw new Error(`${dirPath} has no image file.`);
  const iconDirPath = makeIconDir(dirPath);

  const copiedIconTargetFilePath = await createCopiedIconTargetImg(
    dirPath,
    iconTargetFileName,
    iconDirPath
  );
  const { iconPath, resizedPngPathArray } = await createIcon(
    copiedIconTargetFilePath,
    iconDirPath
  );

  const desktopIniPath = `${dirPath}/desktop.ini`;
  await updateFolderIcon(dirPath, desktopIniPath, iconPath);

  fs.rmSync(copiedIconTargetFilePath);
  resizedPngPathArray.forEach((pngPath) => fs.rmSync(pngPath));
}

async function main(): Promise<void> {
  const dirPaths = process.argv.slice(2);
  for (const dirPath of dirPaths) {
    try {
      if (fs.statSync(dirPath).isDirectory()) {
        console.log(`start setFolderIcon for ${dirPath}`);
        await setFolderIcon(dirPath);
        console.log(`end setFolderIcon for ${dirPath}`);
      }
    } catch (error: any) {
      console.error(`Failed to process directory ${dirPath}\nError: ${error.message}`);
    }
  }
}

main();
