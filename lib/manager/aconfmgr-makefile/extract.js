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
        depName: 'Arch Linux Base',
        currentValue: line.split(/=/)[1],
        datasource: 'archlinuxIso',
      });
    } else if (line.startsWith('SHELLCHECK_VERSION=')) {
      deps.push({
        depName: 'ShellCheck',
        currentValue: line.split(/=/)[1],
        datasource: 'shellcheck',
      });
    }
  }
  return { deps };
}
