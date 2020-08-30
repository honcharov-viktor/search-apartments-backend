function getExpiration(expH, expD) {
  if (!expH && !expD) {
    return 0;
  }

  const val = (1000 * 60 * 60 * (expH || 24) * (expD || 1));
  let exp = new Date().getTime();

  exp += val;

  return exp;
}

module.exports = getExpiration;
