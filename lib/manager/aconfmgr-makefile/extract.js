module.exports = {
  extractPackageFile,
};

function extractPackageFile(content) {
  logger.trace(`aconfmgr-makefile.extractPackageFile()`);
  const lines = content.split(/\n/);
  const deps = [];
  for (const line of lines) {
    if (line.startsWith('ARCH_DATE=')) {
      deps.push({
        depName: 'ARCH_DATE',
        currentValue: line.split(/=/)[1],
        datasource: 'archlinuxIso',
      });
    }
  }
  return { deps };
}
