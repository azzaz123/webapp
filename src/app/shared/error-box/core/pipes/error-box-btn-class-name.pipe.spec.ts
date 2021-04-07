import { ERROR_BOX_EXIT_TYPE } from '@shared/error-box/interfaces/error-box-exit-type';
import { ErrorBoxBtnClassNamePipe } from './error-box-btn-class-name.pipe';

describe('ErrorBoxBtnClassNamePipe', () => {
  it('create an instance', () => {
    const pipe = new ErrorBoxBtnClassNamePipe();
    expect(pipe).toBeTruthy();
  });

  describe('when the clickable element is a button', () => {
    it('should have the appearance of a button', () => {
      const pipe = new ErrorBoxBtnClassNamePipe();
      const className = pipe.transform(ERROR_BOX_EXIT_TYPE.BUTTON);

      expect(className).toEqual('btn-primary');
    });
  });

  describe('when the clickable element is a link', () => {
    it('should have the appearance of a link', () => {
      const pipe = new ErrorBoxBtnClassNamePipe();
      const className = pipe.transform(ERROR_BOX_EXIT_TYPE.LINK);

      expect(className).toEqual('basic');
    });
  });
});
