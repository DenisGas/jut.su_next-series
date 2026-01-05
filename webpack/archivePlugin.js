const path = require('path');
const fs = require('fs');
// eslint-disable-next-line import/no-extraneous-dependencies
const archiver = require('archiver');

const bytesToReadable = (bytes) => {
  if (bytes < 1024) {
    return `${bytes} B`;
  }
  if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(2)} KB`;
  }
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
};

function createArchive(browserDir, version) {
  const archiveDir = path.resolve(__dirname, '..', 'dist', 'prod');
  if (!fs.existsSync(archiveDir)) {
    fs.mkdirSync(archiveDir, { recursive: true });
  }

  const output = fs.createWriteStream(
    path.resolve(
      archiveDir,
      `${process.env.BROWSER || 'chrome'}-${version}.zip`
    )
  );
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', () => {
    const totalBytes = archive.pointer();
    console.log(
      `Archive created: ${totalBytes} B (${bytesToReadable(totalBytes)})`
    );
  });

  archive.on('error', (err) => {
    throw err;
  });

  archive.pipe(output);
  archive.directory(browserDir, false);
  archive.finalize();
}

class ArchivePlugin {
  constructor(version) {
    this.version = version;
  }

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
        createArchive(browserDir, this.version);
        resolve();
      });
    });
  }
}

module.exports = ArchivePlugin;
