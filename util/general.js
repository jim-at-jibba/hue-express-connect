'use strict'

const prettyLog = (string) => {
  console.log(`<====== ${string} ======>`);
};

const prettyErr = (string) => {
  console.error(`!!====== ${string} ======!!`);
};

module.exports = {
  prettyLog,
  prettyErr
}