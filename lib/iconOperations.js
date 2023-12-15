const pngToIco = require('png-to-ico')
const fs = require('node:fs')

/**
 * Converts a PNG image to an ICO file.
 * @param {string[]} resizedPngPathArray - An array of paths to resized PNG images.
 * @param {string} iconPath - The path where the ICO file will be saved.
 * @returns {void}
 */
async function createIcoFromPngImgs(resizedPngPathArray, iconPath) {
  await pngToIco(resizedPngPathArray)
    .then(buf => {
      fs.writeFileSync(iconPath, buf)
    })
    .catch(err => {
      console.log(err)
    })
  return
}

/**
 * Updates the icon resource in the specified .ini file.
 * @param {string} iniPath - The path to the .ini file.
 * @param {string} iconPath - The path to the icon file.
 * @returns {void}
 */
function updateIconResourceOfDesktopIni(iniPath, iconPath) {
  if (!fs.existsSync(iniPath)) {
    const iniContent =
      `[.ShellClassInfo]
IconResource=${iconPath},0
[ViewState]
Mode=
Vid=
FolderType=Generic`
    fs.writeFileSync(iniPath, iniContent, 'utf-8')
  } else {
    let iniContent = fs.readFileSync(iniPath, 'utf-8')
    if (!iniContent.includes('[.ShellClassInfo]')) {
      iniContent += `\n[.ShellClassInfo]\nIconResource=${iconPath},0`
    } else if (!iniContent.includes('IconResource=')) {
      iniContent = iniContent.replace('[.ShellClassInfo]', `[.ShellClassInfo]\nIconResource=${iconPath},0\n`)
    } else {
      iniContent = iniContent.replace(/IconResource=.*?(\n|\r\n|\r|$)/i, `IconResource=${iconPath},0\n`)
    }
    fs.writeFileSync(iniPath, iniContent, 'utf-8')
  }
}

module.exports = { createIcoFromPngImgs, updateIconResourceOfDesktopIni }