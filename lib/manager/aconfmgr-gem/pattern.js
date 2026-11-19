// Pattern of commands which install a pinned version of a Ruby gem
// (in test/docker/Dockerfile and .github/workflows/test.yml).
// Groups:
// 1. everything preceding the version (which includes the gem name)
// 2. the gem name
// 3. the version
const pattern = /(gem install (\S+) -v )(\S+)/;

module.exports = {
  pattern,
};
