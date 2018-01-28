const cpx = require('cpx')
const Bundler = require('parcel-bundler')

Promise.all([
  (new Bundler('./src/main/index.html', {
    outDir: './dist/main/',
    watch: true,
  })).bundle(),
  (new Bundler('./src/options/index.html', {
    outDir: './dist/options/',
    watch: true,
  })).bundle(),
  (new Bundler('./src/background.js', {
    outDir: './dist/',
    watch: true,
  })).bundle(),
  cpx.watch('./src/manifest.json', './dist/')
])
