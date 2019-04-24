const { extractPackageFile } = require('./extract');
const { updateDependency } = require('./update');

const language = 'bash';

module.exports = {
  extractPackageFile,
  language,
  updateDependency,
};
