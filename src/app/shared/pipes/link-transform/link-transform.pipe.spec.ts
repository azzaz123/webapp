import {LinkTransformPipe} from './link-transform.pipe';

describe('LinkTransformPipe', () => {
  it('create an instance', () => {
    const pipe = new LinkTransformPipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform message with link to message with clickable link', () => {
    const pipe = new LinkTransformPipe();

    expect(pipe.transform('Link: https://es.wallapop.com'))
      .toEqual('Link: <a href="https://es.wallapop.com" target="_blank">https://es.wallapop.com</a>');
  });

  it('should transform message with link with parameters to message with clickable link', () => {
    const pipe = new LinkTransformPipe();

    expect(pipe.transform('Link: https://es.wallapop.com?key=value'))
      .toEqual('Link: <a href="https://es.wallapop.com?key=value" target="_blank">https://es.wallapop.com?key=value</a>');
  });

  it('should transform message with double link to message with clickable link', () => {
    const pipe = new LinkTransformPipe();

    expect(pipe.transform('First link https://es.wallapop.com second link https://www.google.pl'))
      .toEqual(`First link <a href="https://es.wallapop.com" target="_blank">https://es.wallapop.com</a> second link <a href="https://www.google.pl" target="_blank">https://www.google.pl</a>`);
  });

  it('should transform message with double repetitive link to message with clickable link', () => {
    const pipe = new LinkTransformPipe();

    expect(pipe.transform('First link https://es.wallapop.com second link https://es.wallapop.com'))
      .toEqual(`First link <a href="https://es.wallapop.com" target="_blank">https://es.wallapop.com</a> second link <a href="https://es.wallapop.com" target="_blank">https://es.wallapop.com</a>`);
  });

  it('should transform message without protocol to clickable link', () => {
    const pipe = new LinkTransformPipe();

    expect(pipe.transform('Link: www.wallapop.com'))
      .toEqual('Link: <a href="//www.wallapop.com" target="_blank">www.wallapop.com</a>');
  });

  it('should not transform message', () => {
    const pipe = new LinkTransformPipe();

    expect(pipe.transform('Do not transform message')).toEqual('Do not transform message');
    expect(pipe.transform('Do not transform message http')).toEqual('Do not transform message http');
    expect(pipe.transform('Do not transform message http://')).toEqual('Do not transform message http://');
    expect(pipe.transform('Do not transform message www')).toEqual('Do not transform message www');
    expect(pipe.transform('Do not transform message www.wallapop')).toEqual('Do not transform message www.wallapop');
    expect(pipe.transform('Do not transform message wallapop.com')).toEqual('Do not transform message wallapop.com');
  });
});
