const tar = require('tar')
const iltorb = require('iltorb')
const fs = require('fs')
const { TFJS_PATH, TAR_PATH } = require('../constants')

tar
  .c({ cwd: TFJS_PATH }, ['index.js', 'node_modules'])
  .pipe(iltorb.compressStream())
  .pipe(fs.createWriteStream(TAR_PATH))
