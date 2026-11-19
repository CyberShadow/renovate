const { pattern } = require('./pattern');

module.exports = {
  extractPackageFile,
};

function extractPackageFile(content) {
  logger.trace(`aconfmgr-gem.extractPackageFile()`);
  const lines = content.split(/\n/);
  const deps = [];
  for (const line of lines) {
    const match = line.match(pattern);
    if (match) {
      deps.push({
        depName: match[2],
        currentValue: match[3],
        datasource: 'rubygems',
        registryUrls: ['https://rubygems.org'],
      });
    }
  }
  return { deps };
}
