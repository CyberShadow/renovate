const got = require('../../util/got');

module.exports = {
  getPkgReleases,
};

const shellcheckUrl = 'https://api.github.com/repos/koalaman/shellcheck/releases';
const reFileName = /^shellcheck-v(.*)\.linux\.x86_64\.tar\.xz$/;

async function getPkgReleases() {
  // First check the persistent cache
  const cacheNamespace = 'datasource-shellcheck';
  const cachedResult = await renovateCache.get(cacheNamespace, 'all');
  // istanbul ignore if
  if (cachedResult) {
    return cachedResult;
  }
  try {
    const res = {
      homepage: 'https://shellcheck.net',
      releases: [],
    };
    const response = await got(shellcheckUrl);
    const releases = JSON.parse(response.body);
    res.releases = releases
      .filter(r => r.tag_name.match(/^v\d+\.\d+\.\d+$/))
      .filter(r => r.assets.filter(a => a.name.match(reFileName)).length)
      .map(r => ({
        version : r.tag_name.substr(1),
        releaseDate : r.created_at.substr(10),
        downloadUrl : r.assets.filter(a => a.name.match(reFileName))[0].browser_download_url
      }))
    ;
    return res;
  } catch (err) {
    if (err && (err.statusCode === 404 || err.code === 'ENOTFOUND')) {
      throw new Error('registry-failure');
    }
    logger.warn({ err }, 'ShellCheck lookup failure: Unknown error');
    throw new Error('registry-failure');
  }
}
