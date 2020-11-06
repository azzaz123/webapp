export function getTimestamp() {
  const now = new Date();
  var dd = (now.getDate() < 10 ? '0' : '') + now.getDate();
  var MM = (now.getMonth() + 1 < 10 ? '0' : '') + (now.getMonth() + 1);
  var yyyy = now.getFullYear();

  return `${yyyy}-${MM}-${dd} ${now.toLocaleTimeString(
    'es-ES'
  )}.${now.getMilliseconds()}`;
}
