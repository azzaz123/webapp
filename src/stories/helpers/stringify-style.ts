export function stringifyStyleObj(style: object) {
  return JSON.stringify(style).replace(/"/g, "'");
}
