const { patterns } = require('./patterns');

module.exports = {
  updateDependency,
};

function updateDependency(fileContent, upgrade) {
  logger.debug(`aconfmgr-aur.updateDependency(): ${upgrade.depName}: ${upgrade.currentValue} -> ${upgrade.newValue}`);

  const release = upgrade.releases.find(r => r.version === upgrade.newValue);

  return patterns.reduce(
    (content, pattern) => content.replace(
      new RegExp(pattern.source, 'g'),
      (match, prefix, pkg, oldRev) =>
        pkg === upgrade.depName && oldRev === upgrade.aurInfo.commit
          ? prefix + release.info.commit
          : match),
    fileContent);
}
