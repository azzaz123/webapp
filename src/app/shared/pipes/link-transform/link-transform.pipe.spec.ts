import {LinkTransformPipe} from './link-transform.pipe';

describe('LinkTransformPipe', () => {
  it('create an instance', () => {
    const pipe = new LinkTransformPipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform message with link to message with clickable link', () => {
    const pipe = new LinkTransformPipe();

    expect(pipe.transform('Basic clicable link: https://es.wallapop.com'))
      .toEqual('Basic clicable link: <a href="https://es.wallapop.com" target="_blank">https://es.wallapop.com</a>');
  });

  it('should transform message with double link to message with clickable link', () => {
    const pipe = new LinkTransformPipe();

    expect(pipe.transform('Basic clicable link: https://es.wallapop.com, second link https://google.com'))
      .toEqual(`Basic clicable link: <a href="https://es.wallapop.com" target="_blank">https://es.wallapop.com</a>,
second link <a href="https://google.com" target="_blank">https://google.com</a>`);

    expect(pipe.transform('Basic clicable link: https://es.wallapop.com, second link https://es.wallapop.com'))
      .toEqual(`Basic clicable link: <a href="https://es.wallapop.com" target="_blank">https://es.wallapop.com</a>,
second link <a href="https://es.wallapop.com" target="_blank">https://es.wallapop.com</a>`);
  });
});
