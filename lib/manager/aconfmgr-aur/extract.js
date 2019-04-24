const { aurQuery } = require('./aurQuery');

module.exports = {
  extractPackageFile,
};

async function extractPackageFile(content) {
  logger.trace(`aconfmgr-aur.extractPackageFile()`);
  const lines = content.split(/\n/);
  const deps = [];
  for (const line of lines) {
    const match = line.match(/TestNeedAURPackage\s+(\S+)\s+([0-9a-f]{40})\b/);
    if (match) {
      const pkg = match[1];
      const commit = match[2];
      const info = await aurQuery(pkg, commit);
      deps.push({
        depName: pkg,
        currentValue: info.version,
        aurInfo: info,
        datasource: 'archlinuxAur',
      });
    }
  }
  return { deps };
}
