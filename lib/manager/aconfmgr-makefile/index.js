const { extractPackageFile } = require('./extract');
const { updateDependency } = require('./update');

const language = 'make';

module.exports = {
  extractPackageFile,
  language,
  updateDependency,
};
