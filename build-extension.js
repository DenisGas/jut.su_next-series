const fs = require('fs');
const archiver = require('archiver');
const path = require('path');

const firefoxGeckoId = "jns@example.com";

// Reads the base manifest file
function readBaseManifest() {
  return JSON.parse(fs.readFileSync(path.join(__dirname, 'manifest.json'), 'utf8'));
}

// Deletes a directory and its contents
function deleteDirectory(directoryPath) {
  // Check if the directory exists
  if (fs.existsSync(directoryPath)) {
    // Get the list of files and directories and delete each one
    fs.readdirSync(directoryPath).forEach((file) => {
      const curPath = path.join(directoryPath, file);
      if (fs.lstatSync(curPath).isDirectory()) { // Recursively delete if it is a directory
        deleteDirectory(curPath);
      } else { // Delete file
        fs.unlinkSync(curPath);
      }
    });
    // Remove the directory itself after it is emptied
    fs.rmdirSync(directoryPath);
  }
}

// Modifies the manifest file based on the browser
// function modifyManifestForBrowser(manifest, browserName) {
//   const modifiedManifest = JSON.parse(JSON.stringify(manifest));
//   if (browserName === 'chrome') {
//     modifiedManifest.manifest_version = 3;
//   } else if (browserName === 'firefox') {
//     modifiedManifest.manifest_version = 2;
//     modifiedManifest.browser_action = modifiedManifest.action; // Assume 'action' has a Chrome-like structure
//     delete modifiedManifest.action;
//     modifiedManifest.browser_specific_settings = {
//       "gecko": {
//         "id": firefoxGeckoId
//       }
//     };
//   }
//   return modifiedManifest;
// }

function modifyManifestForBrowser(manifest, browserName) {
  // Deep copy of the manifest to avoid modifying the original by reference
  const modifiedManifest = JSON.parse(JSON.stringify(manifest));

  if (browserName === 'chrome' || browserName === 'firefox') {
    // Set manifest version for both browsers (if using V3 for Firefox too)

    // Ensure the 'action' key exists if not originally present
    modifiedManifest.action = modifiedManifest.action || {};

    // Flatten the array of matches into a single array of host patterns
    modifiedManifest.host_permissions = modifiedManifest.content_scripts.flatMap(script => script.matches);

    if (browserName === 'firefox') {
      // Uncomment below if you need to use a service worker for background tasks (commented due to partial support)
      // if (!modifiedManifest.background) {
      //   modifiedManifest.background = {
      //     service_worker: "background.js"
      //   };
      // }
      // Specify browser-specific settings for Firefox
      modifiedManifest.browser_specific_settings = {
        "gecko": {
          "id": firefoxGeckoId,
          "strict_min_version": "88.0"
        }
      };
    }
  }
  return modifiedManifest;
}



// Sets up the build environment for a specific browser
function setupBuildEnvironment(browserName) {
  const manifest = modifyManifestForBrowser(readBaseManifest(), browserName);
  const buildDir = path.join(__dirname, 'build', browserName);
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }
  fs.writeFileSync(path.join(buildDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
  return buildDir;
}

// Creates an archive of the build directory
function archiveBuild(buildDir, browserName, version) {
  const distPath = path.join(__dirname, 'dist');
  if (!fs.existsSync(distPath)) {
    fs.mkdirSync(distPath, { recursive: true });
  }

  const outputPath = path.join(distPath, `${browserName}_v${version}.zip`);
  const output = fs.createWriteStream(outputPath);
  const archive = archiver('zip', { zlib: { level: 9 } });

  output.on('close', function () {
    console.log(`${browserName} - Archive created successfully. Total bytes: ${archive.pointer()} | Kilobytes: ${(archive.pointer() / 1024).toFixed(0)}`);
  });

  output.on('error', function (err) {
    console.error('Error with output stream:', err);
    throw err;
  });

  archive.on('error', function (err) {
    console.error('Error with archiving:', err);
    throw err;
  });

  archive.pipe(output);
  archive.directory(buildDir, false);
  archive.finalize();
}

// Builds the extension for a specified browser
function buildForBrowser(browserName) {
  const buildDir = path.join(__dirname, 'build', browserName);

  // Delete existing directory before starting the build
  deleteDirectory(buildDir);

  // Set up the build environment and create a new directory
  setupBuildEnvironment(browserName);

  const manifest = JSON.parse(fs.readFileSync(path.join(buildDir, 'manifest.json'), 'utf8'));
  const version = manifest.version;

  // Copy necessary directories
  ['pages', 'styles', 'scripts', '_locales', 'assets/icons'].forEach(dir => {
    fs.cpSync(path.join(__dirname, dir), path.join(buildDir, dir), { recursive: true });
  });

  // Create the archive
  archiveBuild(buildDir, browserName, version);
}

// Build for Chrome and Firefox
buildForBrowser('chrome');
buildForBrowser('firefox');
