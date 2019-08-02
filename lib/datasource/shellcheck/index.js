const { XmlDocument } = require('xmldoc');
const got = require('../../util/got');

module.exports = {
  getPkgReleases,
};

const shellcheckUrl = 'https://shellcheck.storage.googleapis.com/';

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
    const files = (new XmlDocument(response.body))
          .children
          .filter(node => node.name === 'Contents');
    for (const file of files) {
      const fn = file.valueWithPath('Key');
      const match = fn.match(/^shellcheck-v(.*)\.linux\.x86_64\.tar\.xz$/);
      if (match) {
        const version = match[1];
        const releaseDate = file.valueWithPath('LastModified');
        const sumUrl = shellcheckUrl + fn + '.sha512sum';
        try {
          const sha512sum = (await got(sumUrl)).body.substring(0, 128);
          res.releases.push({ version, releaseDate, sha512sum });
        } catch (err) {
          logger.trace(`Error with ${sumUrl}: ${err}`);
        }
      }
    }
    return res;
  } catch (err) {
    if (err && (err.statusCode === 404 || err.code === 'ENOTFOUND')) {
      throw new Error('registry-failure');
    }
    logger.warn({ err }, 'ShellCheck lookup failure: Unknown error');
    throw new Error('registry-failure');
  }
}
