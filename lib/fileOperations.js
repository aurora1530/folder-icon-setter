const fs = require('node:fs')

/**
 * Creates a directory named 'icon' within the specified directory path.
 * @param {string} dirPath - The path of the directory where the 'icon' directory will be created.
 * @returns {string} - The path of the created 'icon' directory.
 */
function makeIconDir(dirPath) {
  const dirName = 'icon'
  if (!fs.existsSync(dirPath + '\\' + dirName)) fs.mkdirSync(dirPath + '\\' + dirName)
  return dirPath + '\\' + dirName
}

/**
 * Returns the name of the first file in the sorted directory.
 * The target file is a PNG or JPG or JPEG file.
 * @param {string} dirPath - The path of the directory.
 * @returns {string} The name of the first file in the sorted directory.
 */
function getFirstFileNameOfSortedDir(dirPath) {
  const files = fs.readdirSync(dirPath)
    .filter(file => /\.(png|jpe?g)$/i.test(file))
    .sort();
  return files[0];
}

/**
 * Copies a file from the source path to the destination path.
 * @param {string} srcFilePath - The path of the source file.
 * @param {string} destFilePath - The path of the destination file.
 * @returns {String}
 */
function copyFile(srcFilePath, destFilePath) {
  fs.copyFileSync(srcFilePath, destFilePath)
  return destFilePath
}

module.exports = {
  makeIconDir,
  getFirstFileNameOfSortedDir,
  copyFile
}