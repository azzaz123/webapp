import { capitalizeString } from './capitalize-string';

describe('when capitalizing a text', () => {
  it('should set the first letter in caps', () => {
    const input = 'okboomer';
    const expected = 'Okboomer';

    const result = capitalizeString(input);

    expect(result).toEqual(expected);
  });
});
