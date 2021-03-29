import { WebSlugConverterPipe } from './web-slug-converter.pipe';

const userName = 'user-generic-';
const numericId = '76703343';
const hashId = 'idshj2e3sj';

describe('WebSlugConverterPipe', () => {
  it('create an instance', () => {
    const pipe = new WebSlugConverterPipe();
    expect(pipe).toBeTruthy();
  });
});

describe('when we receive the id on the web slug...', () => {
  describe('when the webslug id is numeric', () => {
    const pipe = new WebSlugConverterPipe();
    const numericSlug = `${userName}${numericId}`;

    it('should return the web slug with the hash id', () => {
      expect(pipe.transform(numericSlug, hashId)).toBe(`${userName}${hashId}`);
    });
  });

  describe('when the webslug id is not numeric', () => {
    const pipe = new WebSlugConverterPipe();
    const hashSlug = `${userName}${hashId}`;

    it('should return exactly the same web slug', () => {
      expect(pipe.transform(hashSlug, hashId)).toBe(hashSlug);
    });
  });
});

describe(`when we don't receive the id on the web slug...`, () => {
  const pipe = new WebSlugConverterPipe();

  describe('and the hashId is defined...', () => {
    it('should return the web slug with the hash id', () => {
      expect(pipe.transform(userName, hashId)).toBe(`${userName}${hashId}`);
    });
  });

  describe('and the hashId is NOT defined...', () => {
    it('should return exactly the same web slug', () => {
      expect(pipe.transform(userName, '')).toBe(`${userName}`);
    });
  });
});
