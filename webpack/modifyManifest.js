const fs = require('fs');
const path = require('path');

const baseManifestPath = path.resolve(
  __dirname,
  '..',
  'src',
  'base-manifest.json'
);
const baseManifest = JSON.parse(fs.readFileSync(baseManifestPath, 'utf8'));

function modifyManifest(browser) {
  const manifest = { ...baseManifest };
  if (browser === 'firefox') {
    manifest.manifest_version = 2;
    manifest.applications = {
      gecko: { id: 'jns@example.com' },
    };
    manifest.permissions = [...manifest.permissions];
    manifest.background = { scripts: ['./scripts/background.js'] };
    manifest.browser_action = { default_popup: './pages/popup.html' };
    manifest.web_accessible_resources = [
      './pages/settings.html',
      './scripts/settings.js',
    ];
  } else {
    manifest.manifest_version = 3;
    manifest.background = { service_worker: './scripts/background.js' };
    manifest.action = { default_popup: './pages/popup.html' };
    manifest.web_accessible_resources = [
      {
        resources: ['./pages/settings.html'],
        matches: ['<all_urls>'],
      },
      {
        resources: ['./scripts/settings.js'],
        matches: ['<all_urls>'],
      },
    ];
  }
  return JSON.stringify(manifest, null, 2);
}

module.exports = modifyManifest;
