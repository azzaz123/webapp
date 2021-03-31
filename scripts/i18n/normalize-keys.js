const fs = require('fs');
const xmlParser = require('xml2json');

const englishCopiesFileLocation = 'src/locale/messages.xmb';
const spanishCopiesFileLocation = 'src/locale/es.xtb';
const keyNamePrefix = 'web_';
const translationsFilesLocations = [
  englishCopiesFileLocation,
  spanishCopiesFileLocation
]

const getNodeMessages = (getAutogenerated = false) => {
  const nodes = [];
  const rawEnglishCopiesFile = fs.readFileSync(englishCopiesFileLocation, 'utf8');
  const rawMessagesBundle = xmlParser.toJson(rawEnglishCopiesFile);
  const englishCopiesFileObject = JSON.parse(rawMessagesBundle);
  const translationNodes = englishCopiesFileObject.messagebundle.msg;

  translationNodes.forEach(translationNode => {
    if (getAutogenerated) {
      const id = translationNode.id;
      const isKeyIdGenerated = !isNaN(id) && !isNaN(parseFloat(id));
      if (isKeyIdGenerated) {
        nodes.push(translationNode);
      }
    } else {
      nodes.push(translationNode);
    }
  })

  return nodes;
}

const getNewKeyName = (node, i) => {
  const pathWithoutFilelines = node.source.split(':')[0];
  const pathWithoutExtension = pathWithoutFilelines.replace('.component.html', '');
  const normalizedPath = pathWithoutExtension.replace(/-/g, '/');
  const splittedBySlash = normalizedPath.split('/');
  const newKeyName = splittedBySlash.slice(4, splittedBySlash.length + 1).join('_');

  return `${keyNamePrefix}${newKeyName}_${i}`;
}

const setNewKeyNameInHTML = (node, newKeyName) => {
  const splittedPath = node.source.split(':');
  const filePath = splittedPath[0];
  const keyPosition = splittedPath[1];
  const translationLinePositionInFile = parseInt(keyPosition.split(',')[0]);

  const rawHTML = fs.readFileSync(filePath, 'UTF-8');
  const allLines = rawHTML.split(/\r?\n/);
  let targetLine = allLines[translationLinePositionInFile];

  const isPlaceholder = targetLine.includes('i18n-placeholder');
  if (isPlaceholder) {
    targetLine = targetLine.replace('i18n-placeholder', `i18n-placeholder="@@${newKeyName}"`);
  } else {
    targetLine = targetLine.replace('i18n', `i18n="@@${newKeyName}"`);
  }

  allLines[translationLinePositionInFile] = targetLine;
  const formattedRawHTML = allLines.join('\n');
  fs.writeFileSync(filePath, formattedRawHTML);
}

const setNewKeyNameInCopies = keysToBeUpdated => {
  translationsFilesLocations.forEach(fileLocation => {
    let rawFile = fs.readFileSync(fileLocation, 'utf8');

    keysToBeUpdated.forEach(key => {
      const regexpFindOldKey = new RegExp(key.old, 'g');
      rawFile = rawFile.replace(regexpFindOldKey, key.new);
    });

    fs.writeFileSync(fileLocation, rawFile)
  });
}

const addMissingKeys = () => {
  // Get XML nodes that are generated automatically and don't have manual key
  const nodeMessagesWithoutKeyname = getNodeMessages(true);
  const keysToBeUpdated = [];

  nodeMessagesWithoutKeyname.forEach((node, i) => {
    // Get new key name
    const newKeyName = getNewKeyName(node, i);

    // Set key in HTML file
    // setNewKeyNameInHTML(node, newKeyName);

    // Store old keys to be updated
    keysToBeUpdated.push({ old: node.id, new: newKeyName });
  });

  // Replace old key for new one in copies
  setNewKeyNameInCopies(keysToBeUpdated);
}

const convertKeysToSnakeCaseWithPrefix = () => {
}

const main = () => {
  // Ensure all i18n copies have manual keys and update copies
  addMissingKeys();

  // Convert all keys to snake_case format with prefix
  convertKeysToSnakeCaseWithPrefix();
}

main();
