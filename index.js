const fs = require('node:fs')
const path = require('path')
const { makeIconDir, getFirstFileNameOfSortedDir, copyFile } = require('./lib/fileOperations.js')
const { convertJpgToPng, makeSquareImg, resizePng } = require('./lib/imageOperations.js')
const { convertPngToIco, updateIconResourceOfDesktopIni } = require('./lib/iconOperations.js')
const { execCommand } = require('./lib/commandOperations.js')

/**
 * @param {String} dirPath
 */
function convertRelativeToAbsolutePath(dirPath) {
  if (dirPath.startsWith('./')) dirPath = dirPath.replace('./', '')
  if (!path.isAbsolute(dirPath)) dirPath = path.resolve(dirPath)
  return dirPath
}

/**
 * Main function that performs the setFolderIcon operation.
 *
 * @param {string} dirPath - The path of the directory to set the folder icon for.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
async function main(dirPath) {
  dirPath = convertRelativeToAbsolutePath(dirPath)

  const iconDirPath = makeIconDir(dirPath)
  const iconTargetFileName = getFirstFileNameOfSortedDir(dirPath)
  const iconTargetFilePath = `${dirPath}/${iconTargetFileName}`
  const copiedIconTargetFilePath =
    /\.png$/i.test(iconTargetFileName)
      ? copyFile(iconTargetFilePath, `${iconDirPath}\\${iconTargetFileName}`)
      : await convertJpgToPng(iconTargetFilePath, iconDirPath)

  await makeSquareImg(copiedIconTargetFilePath)
  const resizedPngPathArray = await resizePng(copiedIconTargetFilePath, iconDirPath)
  const iconPath = iconDirPath + '\\' + path.basename(copiedIconTargetFilePath).replace(/\.png$/i, '.ico')
  await convertPngToIco(resizedPngPathArray, iconPath)
  const desktopIniPath = `${dirPath}/desktop.ini`
  updateIconResourceOfDesktopIni(desktopIniPath, iconPath)
  await execCommand(`attrib -s -h "${dirPath}"`)
  await execCommand(`attrib +s +h "${desktopIniPath}"`)
  await execCommand(`attrib +r "${dirPath}"`)
  fs.rmSync(copiedIconTargetFilePath)
  resizedPngPathArray.forEach(pngPath => fs.rmSync(pngPath))
  return;
}

const dirPath = process.argv[2]
main(dirPath)