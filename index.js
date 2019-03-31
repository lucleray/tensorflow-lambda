const tar = require('tar')
const iltorb = require('iltorb')
const fs = require('fs')
const { TFJS_PATH, TAR_PATH } = require('./constants')

// this hack is required to avoid webpack/rollup/... bundling the required path
const requireFunc =
  typeof __webpack_require__ === 'function' ? __non_webpack_require__ : require

function isLambda() {
  return Boolean(process.env['AWS_LAMBDA_FUNCTION_NAME'])
}

async function requireTf() {
  const tf = requireFunc(TFJS_PATH)
  tf.disableDeprecationWarnings()
  return tf
}

async function createTfPromise() {
  // if not in lambda environment, just require the actual package
  // this is useful as a way to bypass tfjs-lambda in development
  if (!isLambda()) {
    return requireFunc('@tensorflow/tfjs-node')
  }

  // if tfjs-node already exists, just require it
  if (fs.existsSync(TFJS_PATH)) {
    return requireTf()
  }

  // else, create the folder and deflate tfjs-node
  fs.mkdirSync(TFJS_PATH)

  // unzip tfjs-node
  await new Promise((resolve, reject) => {
    const x = tar.x({ cwd: TFJS_PATH })

    x.on('finish', resolve)
    x.on('error', reject)

    fs.createReadStream(TAR_PATH)
      .pipe(iltorb.decompressStream())
      .pipe(x)
  })

  return requireTf()
}

let tfPromise

module.exports = function loadTf() {
  if (!tfPromise) {
    tfPromise = createTfPromise()
  }

  return tfPromise
}
