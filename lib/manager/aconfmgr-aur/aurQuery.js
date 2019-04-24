const got = require('../../util/got');

async function aurQuery(pkg, commitSpec) {
  let url = `https://aur.archlinux.org/cgit/aur.git/commit/?h=${pkg}`;
  if (commitSpec) {
    url += `&id=${commitSpec}`;
  }

  const cacheNamespace = 'aconfmgr-aur-query';
  const cachedResult = await renovateCache.get(cacheNamespace, url);
  if (cachedResult) {
    return cachedResult;
  }

  const response = await got(url);
  const commit = response.body.match(/^<tr><th>commit<\/th><td colspan='2' class='sha1'><a href='.*'>([0-9a-f]{40})<\/a> \(<a href='.*'>patch<\/a>\)<\/td><\/tr>$/m)[1];
  const date = response.body.match(/^<tr><th>author<\/th><td>.*<\/td><td class='right'>(....-..-.. ..:..:..) .*<\/td><\/tr>$/m)[1];
  const version = date.replace(/[^0-9]/g, '');
  const result = {
    commit,
    date,
    version,
  };
  await renovateCache.set(cacheNamespace, url, result, commitSpec ? 1e6 : 15);
  return result;
}

module.exports = {
  aurQuery,
};
