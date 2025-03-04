const path = require('path');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const archiver = require('archiver');

function createArchive(browserDir) {
  const archiveDir = path.resolve(__dirname, '..', 'dist', 'prod');
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  const output = fs.createWriteStream(
    path.resolve(archiveDir, `${process.env.BROWSER || 'chrome'}.zip`)
  );
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    console.log(`Archive created: ${archive.pointer()} total bytes`);
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(browserDir, false);
  archive.finalize();
}

class ArchivePlugin {
  apply(compiler) {
    compiler.hooks.afterEmit.tapPromise('ArchivePlugin', () => {
      if (process.env.NODE_ENV !== 'production') {
        return Promise.resolve();
      }

      const browserDir = path.resolve(
        __dirname,
        '..',
        'dist',
        process.env.BROWSER || 'chrome'
      );
      return new Promise((resolve) => {
        createArchive(browserDir);
        resolve();
      });
    });
  }
}

module.exports = ArchivePlugin;
