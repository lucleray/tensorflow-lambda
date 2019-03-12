const tar = require('tar')
const iltorb = require('iltorb')
const fs = require('fs')
const { resolve } = require('path')

const requireFunc =
  typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require

let tf
let tfPromise

async function loadTf(path = '/tmp') {
  if (tf) {
    return tf
  }

  try {
    const tfjsPath = resolve(path, 'tfjs-node')
    const tarPath = resolve(__dirname, 'tfjs-node.br')

    if (fs.existsSync(tfjsPath)) {
      tf = requireFunc(tfjsPath)
      tf.disableDeprecationWarnings()
      return tf
    }

    fs.mkdirSync(tfjsPath)

    // unzip tfjs-node
    await new Promise((resolve, reject) => {
      const x = tar.x({ cwd: tfjsPath })

      x.on('finish', resolve)
      x.on('error', reject)

      fs.createReadStream(tarPath)
        .pipe(iltorb.decompressStream())
        .pipe(x)
    })

    tf = requireFunc(tfjsPath)
    tf.disableDeprecationWarnings()

    return tf
  } catch (err) {
    console.log(err)
  }
}

module.exports = path => {
  if (!tfPromise) {
    tfPromise = loadTf(path)
  }

  return tfPromise
}
