const fs = require('fs');
const glob = require('glob');
const Path = require('path');

const momentLocalesPattern = 'node_modules/moment/locale/*.js';

const allowedLocales = ['es', 'en-gb'];

const getLocaleNameFromFilePath = localeFilePath => {
  return Path.parse(localeFilePath).name.replace('.js', '');
}

const isLocaleFileAllowed = locale => {
  return allowedLocales.find(allowedLocale => allowedLocale === locale);
}

const removeLocaleFileIfNotAllowed = localeFilePath => {
  const localeName = getLocaleNameFromFilePath(localeFilePath);
  if (!isLocaleFileAllowed(localeName)) {
    fs.unlinkSync(localeFilePath);
  }
}

const main = () => {
  glob(momentLocalesPattern, {}, (err, localesPath) => {
    localesPath.forEach(localeFilePath => removeLocaleFileIfNotAllowed(localeFilePath));
  });
}

main();