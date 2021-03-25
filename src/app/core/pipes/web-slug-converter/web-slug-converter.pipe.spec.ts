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
