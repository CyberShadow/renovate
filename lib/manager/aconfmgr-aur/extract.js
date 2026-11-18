const { aurQuery } = require('./aurQuery');
const { patterns } = require('./patterns');

module.exports = {
  extractPackageFile,
};

async function extractPackageFile(content) {
  logger.trace(`aconfmgr-aur.extractPackageFile()`);
  const lines = content.split(/\n/);
  const deps = [];
  for (const line of lines) {
    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        const pkg = match[2];
        const commit = match[3];
        const info = await aurQuery(pkg, commit);
        deps.push({
          depName: pkg,
          currentValue: info.version,
          aurInfo: info,
          datasource: 'archlinuxAur',
        });
      }
    }
  }
  return { deps };
}
