function config(entry = []) {
  return [...entry, require.resolve('./dist/preset/preview')];
}

module.exports = {
  config,
};
