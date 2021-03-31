const fs = require('fs');
const xmlParser = require('xml2json');

const englishCopiesFileLocation = 'src/locale/messages.xmb';
const keyNamePrefix = 'web_';

const getNodeMessagesWithoutKeyname = () => {
  const nodesWithoutKeyname = [];
  const rawEnglishCopiesFile = fs.readFileSync(englishCopiesFileLocation, 'utf8');
  const rawMessagesBundle = xmlParser.toJson(rawEnglishCopiesFile);
  const englishCopiesFileObject = JSON.parse(rawMessagesBundle);
  const translations = englishCopiesFileObject.messagebundle.msg;

  translations.forEach(translation => {
    const id = translation.id
    const isKeyIdGenerated = !isNaN(id) && !isNaN(parseFloat(id));

    if (isKeyIdGenerated) {
      nodesWithoutKeyname.push(translation)
    }
  })

  return nodesWithoutKeyname;
}

const getNewKeyName = (node, i) => {
  const pathWithoutFilelines = node.source.split(':')[0];
  const pathWithoutExtension = pathWithoutFilelines.replace('.component.html', '');
  const normalizedPath = pathWithoutExtension.replace(/-/g, '/');
  const splittedBySlash = normalizedPath.split('/');
  const newKeyName = splittedBySlash.slice(4, splittedBySlash.length + 1).join('_');

  return `${keyNamePrefix}${newKeyName}_${i}`;
}

const setNewKeyNameInHTML = () => {}
const setNewKeyNameInCopies = () => {}

const main = () => {
  // Get XML nodes that are generated automatically and don't have manual key
  const nodeMessagesWithoutKeyname = getNodeMessagesWithoutKeyname();

  nodeMessagesWithoutKeyname.forEach((node, i) => {
    // // Get new key name
    const newKeyName = getNewKeyName(node, i);

    // // Set key in HTML file
    // setNewKeyNameInHTML(html, line, newKeyName);

    // // Replace old key for new one in copies
    // setNewKeyNameInCopies(node.id, newKeyName);
  });
}

main();
