const got = require('../../util/got');

module.exports = {
  getPkgReleases,
};

const archIsoUrl = 'https://archive.archlinux.org/iso/';

async function getPkgReleases() {
  // First check the persistent cache
  const cacheNamespace = 'datasource-archlinux-iso';
  const cachedResult = await renovateCache.get(cacheNamespace, 'all');
  // istanbul ignore if
  if (cachedResult) {
    return cachedResult;
  }
  try {
    const res = {
      homepage: 'https://archlinux.org',
      releases: [],
    };
    const response = await got(archIsoUrl);
    const reg = /<a href="(\d\d\d\d\.\d\d\.\d\d)\/">\1\/<\/a>/g;
    for (let match = reg.exec(response.body); match !== null; match = reg.exec(response.body)) {
      const version = match[1];
      const releaseDate = version;
      res.releases.push({ version, releaseDate });
    }
    await renovateCache.set(cacheNamespace, 'all', res, 15);
    return res;
  } catch (err) {
    if (err && (err.statusCode === 404 || err.code === 'ENOTFOUND')) {
      throw new Error('registry-failure');
    }
    logger.warn({ err }, 'Arch Linux ISO lookup failure: Unknown error');
    throw new Error('registry-failure');
  }
}
