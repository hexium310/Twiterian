const fs = require('mz/fs');
const path = require('path');
const JSZip = require('node-zip');
const glob = require('glob-promise');

const zip = new JSZip();
const target = `./releases/${require('../package').version}.zip`;

const addFile = async () => {
  for (let file of await glob('releases/src/**', {
    nodir: true,
  })) {
    const [, ...filename] = file.split(path.sep);

    zip.file(path.join(...filename), await fs.readFile(file));
  }
  return zip;
};

addFile().then((zip) => {
  fs.writeFile(target, zip.generate({
    base64: false,
    compression: 'DEFLATE',
  }), 'binary');
}).then(() => {
  /* eslint no-console: "off" */
  console.log(`${target} has created.`);
});
