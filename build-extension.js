const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

// Read data from manifest.json
const manifest = JSON.parse(fs.readFileSync('manifest.json', 'utf8'));
const version = manifest.version; // Retrieve the version from the manifest

// Path to the directory where the archive will be saved
const distPath = path.join(__dirname, 'dist');

// Create a folder for the archive if it does not exist yet
if (!fs.existsSync(distPath)) {
  fs.mkdirSync(distPath);
}

// Create an archive file with the version in the name
const output = fs.createWriteStream(path.join(distPath, `extension-${version}.zip`));
const archive = archiver('zip', {
  zlib: { level: 9 } // Maximum compression ratio
});

output.on('close', function() {
  console.log(`Archive created successfully. Total bytes: ${archive.pointer()}`);
});

archive.on('error', function(err) {
  throw err;
});

// Start archiving
archive.pipe(output);

// Add files and folders to the archive
const filesToInclude = [
  'manifest.json',
  'LICENSE.md',
  'README.md',
  'privacy_policy.md'
];

filesToInclude.forEach(file => {
  archive.file(file, { name: file });
});

// Add directories
archive.directory('pages/', 'pages');
archive.directory('styles/', 'styles');
archive.directory('scripts/', 'scripts');
archive.directory('_locales/', '_locales');
archive.directory('assets/icons/', 'assets/icons');

// Finish archiving
archive.finalize();
