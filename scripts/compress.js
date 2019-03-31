const tar = require('tar')
const iltorb = require('iltorb')
const fs = require('fs')

tar
  .c({ cwd: '/tmp/tfjs-node' }, ['index.js', 'node_modules'])
  .pipe(iltorb.compressStream())
  .pipe(fs.createWriteStream('../tfjs-node.br'))
