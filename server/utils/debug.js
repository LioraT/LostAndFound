// utils/debug.js
require('dotenv').config(); // just in case this file is used early

const DEBUG_MODE = process.env.DEBUG_MODE === 'true';

const debug = {
  log: (...args) => {
    if (DEBUG_MODE) {
      console.log(...args);
    }
  }
};

module.exports = debug;
