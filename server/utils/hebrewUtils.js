  function isMostlyRTL(str) {
    const hebrewRange = /[\u0590-\u05FF]/g;
    const matches = str.match(hebrewRange);
    const ratio = matches ? matches.length / str.length : 0;
    return ratio > 0.3; // Adjust if needed
  }

  function hebrewStr(str) {
    if (typeof str !== 'string') return str;

    let decoded;
    try {
      decoded = decodeURIComponent(str);
    } catch {
      decoded = str;
    }

    return isMostlyRTL(decoded)
      ? decoded.split('').reverse().join('')
      : decoded;
  }

  function hebrewUrl(url) {
    if (typeof url !== 'string') return url;
    return url
      .split('/')
      .map(part => hebrewStr(part))
      .join('/');
  }

  module.exports = {
    hebrewStr,
    hebrewUrl,
    isMostlyRTL
  };
