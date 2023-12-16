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

/**
 * Main function that performs the setFolderIcon operation.
 *
 * @param {string} dirPath - The path of the directory to set the folder icon for.
 * @returns {Promise<void>} - A Promise that resolves when the operation is complete.
 */
async function setFolderIcon(dirPath) {
  dirPath = convertRelativeToAbsolutePath(dirPath)

  const iconTargetFileName = getFirstFileNameOfSortedDir(dirPath)
  if (!iconTargetFileName) new Error(`${dirPath} has no image file.`)
  const iconDirPath = makeIconDir(dirPath)

  const iconTargetFilePath = `${dirPath}/${iconTargetFileName}`
  const copiedIconTargetFilePath =
    /\.png$/i.test(iconTargetFileName)
      ? copyFile(iconTargetFilePath, `${iconDirPath}\\${iconTargetFileName}`)
      : await copyJpgAsPng(iconTargetFilePath, iconDirPath)

  await convertImgToSquare(copiedIconTargetFilePath)
  const resizedPngPathArray = await createResizedSquareImages(copiedIconTargetFilePath, iconDirPath)
  const iconPath = iconDirPath + '\\' + 'icon.ico'
  await createIcoFromPngImgs(resizedPngPathArray, iconPath)

  const desktopIniPath = `${dirPath}/desktop.ini`
  await execCommand(`attrib -r "${dirPath}"`)
  await execCommand(`attrib -s -h "${desktopIniPath}"`)
  updateIconResourceOfDesktopIni(desktopIniPath, iconPath)
  await execCommand(`attrib -s -h "${dirPath}"`)
  await execCommand(`attrib +s +h "${desktopIniPath}"`)
  await execCommand(`attrib +r "${dirPath}"`)//Required to display icons

  fs.rmSync(copiedIconTargetFilePath)
  resizedPngPathArray.forEach(pngPath => fs.rmSync(pngPath))
  return;
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