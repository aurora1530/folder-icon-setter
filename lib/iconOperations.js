const pngToIco = require('png-to-ico')
const fs = require('node:fs')
/**
 * Converts a PNG image to an ICO file.
 * @param {string[]} resizedPngPathArray - An array of paths to resized PNG images.
 * @param {string} iconPath - The path where the ICO file will be saved.
 * @returns {void}
 */
async function convertPngToIco(resizedPngPathArray, iconPath) {
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
  let lines;
  if (fs.existsSync(iniPath)) {
    fs.copyFileSync(iniPath, iniPath.replace(/desktop\.ini$/i, 'desktop.ini.bak'))
    fs.rmSync(iniPath)
    // lines = fs.readFileSync(iniPath, 'utf-8').split('\n');
  } else {
  }
  lines = [];
  const newLines = lines.map(line =>
    line.startsWith('IconResource=') ? `IconResource=${iconPath},0` : line
  );
  if (!newLines.some(line => line === '[.ShellClassInfo]')) {
    newLines.push('[.ShellClassInfo] ')
    newLines.push(`IconResource=${iconPath},0`);
  }
  if (!newLines.some(line => line.startsWith('IconResource='))) {
    newLines.push(`IconResource=${iconPath},0`);
  }
  fs.writeFileSync(iniPath, newLines.join('\n'));
}

module.exports = { convertPngToIco, updateIconResourceOfDesktopIni }