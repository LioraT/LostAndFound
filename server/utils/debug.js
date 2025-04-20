// utils/debug.js
require('dotenv').config(); // just in case this file is used early

const DEBUG_MODE = process.env.DEBUG_MODE === 'true';

function isMostlyRTL(str) {
  const rtlChars = str.match(/[\u0590-\u05FF]/g);
  return rtlChars && rtlChars.length > str.length / 2;
}

function hebstr_i(str) {
  if (typeof str !== 'string') return str;

  let decoded;
  try {
    decoded = decodeURIComponent(str);
  } catch {
    decoded = str; // fallback if not URI encoded
  }

  return isMostlyRTL(decoded)
    ? decoded.split('').reverse().join('')
    : decoded;
}

function heburl_i(url) {
  if (typeof url !== 'string') return url;
  return url
    .split('/')
    .map(part => hebstr_i(part))
    .join('/');
}

const debug = {
  hebstr : (str) => hebstr_i(str),
  heburl : (url) => heburl_i(url),
  log: (...args) => {
    if (DEBUG_MODE) {
      console.log(...args);
    }
  }
};

module.exports = debug;
