// Patterns of lines which pin an AUR package to a commit.
// Each pattern must have exactly three groups:
// 1. everything preceding the commit hash (which includes the package name)
// 2. the package name
// 3. the commit hash
const patterns = [
  // test/t/*
  /(TestNeedAURPackage\s+(\S+)\s+)([0-9a-f]{40})\b/,
  // test/docker/Dockerfile
  /(git clone https:\/\/aur\.archlinux\.org\/(\S+)\.git && git -C \S+ checkout )([0-9a-f]{40})\b/,
];

module.exports = {
  patterns,
};
