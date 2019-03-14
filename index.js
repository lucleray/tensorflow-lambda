const tar = require('tar')
const iltorb = require('iltorb')
const fs = require('fs')
const { resolve: pathResolve } = require('path')

const requireFunc =
  typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require

function isLambda() {
  return Boolean(process.env['AWS_LAMBDA_FUNCTION_NAME'])
}

async function createTfPromise(path) {
  const tfjsPath = pathResolve(__dirname, path, 'tfjs-node')
  const tarPath = 'tfjs-node.br'

  if (fs.existsSync(tfjsPath)) {
    const tf = requireFunc(tfjsPath)
    tf.disableDeprecationWarnings()
    return tf
  }

  fs.mkdirSync(tfjsPath)

  // unzip tfjs-node
  await new Promise((resolve, reject) => {
    const x = tar.x({ cwd: tfjsPath })

    x.on('finish', resolve)
    x.on('error', reject)

    fs.createReadStream(pathResolve(__dirname, tarPath))
      .pipe(iltorb.decompressStream())
      .pipe(x)
  })

  const tf = requireFunc(tfjsPath)
  tf.disableDeprecationWarnings()
  return tf
}

module.exports = function createTfLoader({
  path = isLambda() ? '/tmp' : './'
} = {}) {
  let tfPromise

  return async function loadTf() {
    if (!tfPromise) {
      tfPromise = createTfPromise(path)
    }

    return tfPromise
  }
}
