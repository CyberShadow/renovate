const crypto = require('crypto');
const got = require('../../util/got');

function sha512of(data) {
  const hash = crypto.createHash('sha512');
  hash.update(data);
  return hash.digest('hex');
}

module.exports = {
  updateDependency,
};

async function updateDependency(fileContent, upgrade) {
  logger.debug(`aconfmgr-makefile.updateDependency(): ${upgrade.depName}: ${upgrade.currentValue} -> ${upgrade.newValue}`);

  let content = fileContent;

  switch (upgrade.depName) {
  case 'Arch Linux Base': {
    const date = upgrade.newValue;
    const sumUrl = `https://archive.archlinux.org/iso/${date}/sha1sums.txt`;
    const sums = (await got(sumUrl))
          .body
          .split(/\r?\n/)
          .filter(line => line.endsWith('-x86_64.tar.gz'))
          .map((line => line.substring(0, 40)));
    const sum = sums[0];
    content = fileContent
      .replace(/(?<=ARCH_DATE=).*/, date)
      .replace(/(?<=ARCH_TAR_SHA1=).*/, sum)
    ;
    break;
  }
  case 'ShellCheck': {
    let sha512sum;
    for (const release of upgrade.releases) {
      if (release.version === upgrade.newValue) {
        const r = await got(release.downloadUrl);
        sha512sum = sha512of(r.body);
      }
    }
    content = fileContent
      .replace(/(?<=SHELLCHECK_VERSION=).*/, upgrade.newValue)
      .replace(/(?<=SHELLCHECK_TAR_SHA512=).*/, sha512sum)
    ;
    break;
  }
  default:
    throw new Error('Unknown dependency: ' + upgrade.depName);
  }

  return content;
}
