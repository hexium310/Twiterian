const fs = require('mz/fs')
const JSZip = require('node-zip')
const glob = require('glob-promise')

const zip = new JSZip()
const target = `./releases/${require('../package').version}.zip`

const addFile = async () => {
  for (const filename of await glob('src/**')) {
    const file = await fs.readFile(filename).catch(() => {})
    if (!file) {
      continue
    }

    zip.file(filename, file)
  }
  return zip
}

addFile().then(zip => {
  fs.writeFile(target, zip.generate({
    base64: false,
    compression: 'DEFLATE',
  }), 'binary')
}).then(() => {
  /* eslint no-console: "off" */
  console.log(`${target} has created.`)
})

