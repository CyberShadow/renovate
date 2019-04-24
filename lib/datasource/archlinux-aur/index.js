const { aurQuery } = require('../../manager/aconfmgr-aur/aurQuery');

module.exports = {
  getPkgReleases,
};

async function getPkgReleases({ lookupName }) {
  const pkg = lookupName;
  try {
    const info = await aurQuery(pkg);
    return {
      homepage: `https://aur.archlinux.org/packages/${pkg}/`,
      releases: [{
        version : info.version,
        releaseDate : info.date,
        info,
      }],
    };
  } catch (err) {
    if (err && (err.statusCode === 404 || err.code === 'ENOTFOUND')) {
      throw new Error('registry-failure');
    }
    logger.warn({ err }, 'Arch Linux AUR lookup failure: Unknown error');
    throw new Error('registry-failure');
  }
}
