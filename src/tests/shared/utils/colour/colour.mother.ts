export class ColourMother {
  static randomHex(): string {
    return Math.floor(Math.random() * 16777215).toString(16);
  }
}
