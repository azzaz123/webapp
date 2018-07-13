export function getTimestamp() {
  const now = new Date();
  return `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()} ${now.toLocaleTimeString('es-ES')}.${now.getMilliseconds()}`;
}
