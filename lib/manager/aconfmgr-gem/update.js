const { pattern } = require('./pattern');

module.exports = {
  updateDependency,
};

function updateDependency(fileContent, upgrade) {
  logger.debug(`aconfmgr-gem.updateDependency(): ${upgrade.depName}: ${upgrade.currentValue} -> ${upgrade.newValue}`);

  return fileContent.replace(
    new RegExp(pattern.source, 'g'),
    (match, prefix, gem, oldVersion) =>
      gem === upgrade.depName && oldVersion === upgrade.currentValue
        ? prefix + upgrade.newValue
        : match);
}
