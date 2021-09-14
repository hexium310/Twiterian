import { promises as fs } from 'fs';
import path from 'path';
import JSZip from 'jszip';
import glob from 'glob-promise';
import packageJson from '../package.json';

const zip = new JSZip();
const target = `./releases/${ packageJson.version }.zip`;

for (const file of await glob('releases/src/**', {
  nodir: true,
})) {
  const [, ...filename] = file.split(path.sep);

  zip.file(path.join(...filename), await fs.readFile(file));
}

fs.writeFile(target, await zip.generateAsync({
  type: 'nodebuffer',
  compression: 'DEFLATE',
})).then(() => {
  /* eslint no-console: "off" */
  console.log(`${target} has created.`);
});
