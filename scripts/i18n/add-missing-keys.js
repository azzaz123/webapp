const getNodeMessagesWithoutKeyname = () => []
const getNewKeyName = () => {}
const setNewKeyNameInHTML = () => {}
const setNewKeyNameInCopies = () => {}

const main = () => {
  // Get XML nodes that are generated automatically and don't have manual key
  const nodeMessagesWithoutKeyname = getNodeMessagesWithoutKeyname();

  nodeMessagesWithoutKeyname.forEach((node, i) => {
    // Get new key name
    const newKeyName = getNewKeyName(node, i);

    // Set key in HTML file
    setNewKeyNameInHTML(html, line, newKeyName);

    // Replace old key for new one in copies
    setNewKeyNameInCopies(node.id, newKeyName);
  });
}

main();
