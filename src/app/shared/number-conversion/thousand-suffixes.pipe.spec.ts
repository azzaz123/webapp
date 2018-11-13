import { ThousandSuffixesPipe } from './thousand-suffixes.pipe';

fdescribe('ThousandSuffixesPipe', () => {
  let pipe: ThousandSuffixesPipe;

  beforeEach(() => {
    pipe = new ThousandSuffixesPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should transform number with suffix', () => {
    expect(pipe.transform(1200, 0)).toEqual('1k');
    expect(pipe.transform(1200, 1)).toEqual('1.2k');
    expect(pipe.transform(1200, 2)).toEqual('1.20k');
    expect(pipe.transform(1200000, 1)).toEqual('1.2M');
    expect(pipe.transform(1200000000, 1)).toEqual('1.2G');
  });
});
