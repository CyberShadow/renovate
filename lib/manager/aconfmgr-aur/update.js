module.exports = {
  updateDependency,
};

function updateDependency(fileContent, upgrade) {
  logger.debug(`aconfmgr-aur.updateDependency(): ${upgrade.depName}: ${upgrade.currentValue} -> ${upgrade.newValue}`);

  return fileContent.replace(
    /(TestNeedAURPackage\s+(\S+)\s+)([0-9a-f]{40})\b/g,
    (match, p1, p2, p3) => {
      const pkg = p2;
      const oldRev = p3;
      if (pkg === upgrade.depName && oldRev === upgrade.aurInfo.commit) {
        for (const release of upgrade.releases) {
          if (release.version === upgrade.newValue) {
            return p1 + release.info.commit;
          }
        }
      }
      return match;
    });
}
