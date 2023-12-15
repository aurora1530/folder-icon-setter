const Jimp = require('jimp');
const path = require('path')

/**
 * Converts a JPG image to PNG format.
 * @param {string} jpgImgPath - The path of the JPG image file.
 * @param {string} outputDirPath - The path of the output directory.
 * @returns {Promise<string>} The path of the converted PNG image file.
 */
async function convertJpgToPng(jpgImgPath, outputDirPath) {
  const img = await Jimp.read(jpgImgPath)
  const outputFilename = path.basename(jpgImgPath).replace(/\.jpe?g$/i, '.png')
  const pngPath = outputDirPath + '\\' + outputFilename
  await img.writeAsync(pngPath)
  return pngPath
}

/**
 * Makes a square image by adding padding to the smaller dimension and centering the original image.
 * @param {string} pngPath - The path to the PNG image file.
 * @returns {Promise<void>} - A promise that resolves when the square image is created.
 */
async function makeSquareImg(pngPath) {
  const image = await Jimp.read(pngPath);
  const size = Math.max(image.bitmap.width, image.bitmap.height);
  const newImage = new Jimp(size, size, 0x000000ff);
  const x = (size - image.bitmap.width) / 2;
  const y = (size - image.bitmap.height) / 2;
  newImage.composite(image, x, y);
  await newImage.writeAsync(pngPath);
  return;
}

/**
 * @param {String} pngPath
 * @param {String} iconDirPath
 * @returns {String[]} resizedPngPathArray
 */
async function resizePng(pngPath, iconDirPath) {
  const sizeArray = [512, 256, 128, 96, 64, 48, 32, 24, 16]
  const resizedPngPathArray = []
  for (const size of sizeArray) {
    const image = await Jimp.read(pngPath);
    image.resize(size, size, Jimp.RESIZE_NEAREST_NEIGHBOR);
    const resizedPngPath = `${iconDirPath}\\${size}x${size}.png`
    await image.writeAsync(resizedPngPath);
    resizedPngPathArray.push(resizedPngPath)
  }
  return resizedPngPathArray
}

module.exports = { convertJpgToPng, makeSquareImg, resizePng }