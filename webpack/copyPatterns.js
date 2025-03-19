const path = require('path');

/**
 * Creates an object with paths to copy
 * @param {string} from - Input path
 * @param {string} to - Output path
 * @returns {object} An object with the from and to properties
 */
const fromTo = (from, to) => ({ from, to });

/**
 * Generates an array of templates for copying files
 * @param {string} browserDir - Browser directory where files will be copied
 * @param {string} manifestPath - Path to the manifesto file
 * @returns {Array<object>} Array of objects with paths to copy
 */
const getCopyPatterns = (browserDir, manifestPath) => [
  fromTo('src/icons', path.resolve(browserDir, 'icons')),
  fromTo('src/_locales', path.resolve(browserDir, '_locales')),
  fromTo('src/pages', path.resolve(browserDir, 'pages')),
  fromTo('src/styles', path.resolve(browserDir, 'styles')),
  fromTo(manifestPath, path.resolve(browserDir, 'manifest.json')),
];

module.exports = getCopyPatterns;
