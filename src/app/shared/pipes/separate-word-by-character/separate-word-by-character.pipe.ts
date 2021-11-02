import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'separateWordByCharacter',
})
export class SeparateWordByCharacterPipe implements PipeTransform {
  public transform(value: string, delimiter: number, character: string): string {
    const rgxp = new RegExp(`.{1,${delimiter}}`, 'g');
    const cleanedValue = value.split(character).join('');
    const result = cleanedValue?.match(new RegExp(rgxp))?.join(character) || '';
    return result;
  }
}
