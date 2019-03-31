const { resolve: pathResolve } = require('path')

const TFJS_PATH = '/tmp/tfjs-node'
const TAR_PATH = pathResolve(__dirname, 'tfjs-node.br')

module.exports = { TFJS_PATH, TAR_PATH }
