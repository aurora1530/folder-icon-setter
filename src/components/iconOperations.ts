import pngToIco from 'png-to-ico'
import fs from 'fs'

/**
 * Converts a PNG image to an ICO file.
 * @param {string[]} resizedPngPathArray - An array of paths to resized PNG images.
 * @param {string} iconPath - The path where the ICO file will be saved.
 */
async function createIcoFromPngImgs(resizedPngPathArray: string[], iconPath: string): Promise<void> {
  await pngToIco(resizedPngPathArray)
    .then(buf => {
      fs.writeFileSync(iconPath, buf)
    })
    .catch(err => {
      console.log(err)
    })
  return
}

function changePathToWindowsStyle(path: string): string {
  return path.replace(/\//g, '\\')
}

/**
 * Updates the icon resource in the specified .ini file.
 * @param {string} iniPath - The path to the .ini file.
 * @param {string} iconPath - The path to the icon file.
 * @returns {void}
 */
function updateIconResourceOfDesktopIni(iniPath: string, iconPath: string): void {
  iconPath = changePathToWindowsStyle(iconPath)
  if (!fs.existsSync(iniPath)) {
    const iniContent =
      `[.ShellClassInfo]
IconResource=${iconPath},0
[ViewState]
Mode=
Vid=
FolderType=Generic
`
    fs.writeFileSync(iniPath, iniContent, 'utf-8')
  } else {
    let iniContent = fs.readFileSync(iniPath, 'utf-8')
    if (!iniContent.includes('[.ShellClassInfo]')) {
      iniContent += `\r\n[.ShellClassInfo]\r\nIconResource=${iconPath},0\r\n`
    } else if (!iniContent.includes('IconResource=')) {
      iniContent = iniContent.replace('[.ShellClassInfo]', `[.ShellClassInfo]\nIconResource=${iconPath},0\r\n`)
    } else {
      iniContent = iniContent.replace(/IconResource=.*?(\n|\r\n|\r|$)/i, `IconResource=${iconPath},0\r\n`)
    }

    if (!iniContent.includes('[ViewState]')) {
      iniContent += '\r\n[ViewState]\r\nMode=\r\nVid=\r\nFolderType=Generic\r\n'
    }

    fs.writeFileSync(iniPath, iniContent, 'utf-8')
  }
}

export { createIcoFromPngImgs, updateIconResourceOfDesktopIni }