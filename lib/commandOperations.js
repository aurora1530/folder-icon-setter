const { exec } = require('child_process');

/**
 *
 * @param {String} command
 * @returns {Promise<{stdout: String, stderr: String}>}
 */
function execCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (err, stdout, stderr) => {
      if (err) reject(err)
      else resolve({ stdout, stderr })
    })
  })
}

module.exports = { execCommand }