import fs from 'fs';

/**
 * Creates a directory named 'icon' within the specified directory path.
 * @param {string} dirPath - The path of the directory where the 'icon' directory will be created.
 * @returns {string} - The path of the created 'icon' directory.
 */
function makeIconDir(dirPath: string): string {
  const iconDirPath = `${dirPath}\\icon`;
  if (!fs.existsSync(iconDirPath)) fs.mkdirSync(iconDirPath);
  return iconDirPath;
}

/**
 * Returns the name of the first file in the sorted directory.
 * The target file is a PNG or JPG or JPEG file.
 * @param {string} dirPath - The path of the directory.
 * @returns {string} The name of the first file in the sorted directory.
 */
function getFirstFileNameOfSortedDir(dirPath: string): string {
  const files = fs
    .readdirSync(dirPath)
    .filter((file) => /\.(png|jpe?g)$/i.test(file))
    .sort();
  return files[0];
}

/**
 * Copies a file from the source path to the destination path.
 * returns the destination path.
 * @param {string} srcFilePath - The path of the source file.
 * @param {string} destFilePath - The path of the destination file.
 * @returns {String}
 */
function copyFile(srcFilePath: string, destFilePath: string): string {
  fs.copyFileSync(srcFilePath, destFilePath);
  return destFilePath;
}

export { makeIconDir, getFirstFileNameOfSortedDir, copyFile };
