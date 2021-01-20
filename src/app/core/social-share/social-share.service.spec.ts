import { TestBed } from '@angular/core/testing';
import { SocialShareService } from './social-share.service';

describe('SocialShareService', () => {
  let service: SocialShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SocialShareService],
    }).compileComponents();
    service = TestBed.inject(SocialShareService);
  });

  describe('when requesting facebook link', () => {
    it('should open link', () => {
      spyOn(window, 'open');
      const itemLink = 'test';

      service.facebookShare(itemLink);

      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        `https://www.facebook.com/dialog/share?app_id=258778180928082&display=popup&href=${encodeURIComponent(
          itemLink
        )}`,
        'fbShareWindow',
        'height=450, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
      );
    });
  });

  describe('when requesting twitter link', () => {
    it('should open link', () => {
      spyOn(window, 'open');
      const itemLink = 'test';

      service.twitterShare(itemLink);

      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(itemLink)}`,
        'twShareWindow',
        'height=269, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
      );
    });
  });

  describe('when requesting twitter link with text', () => {
    it('should open link', () => {
      spyOn(window, 'open');
      const itemLink = 'test';
      const text = 'test';

      service.twitterShare(itemLink, text);

      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(
          itemLink
        )}&text=${encodeURIComponent(text)}`,
        'twShareWindow',
        'height=269, width=550, toolbar=0, location=0, menubar=0, directories=0, scrollbars=0'
      );
    });
  });

  describe('when requesting email share', () => {
    it('should open link', () => {
      spyOn(window, 'open');
      const itemLink = 'test';
      const subject = 'test';
      const message = 'test';

      service.emailShare(itemLink, subject, message);

      expect(window.open).toHaveBeenCalledTimes(1);
      expect(window.open).toHaveBeenCalledWith(
        `mailto:?body=${message} - ${itemLink}&subject=${subject}`
      );
    });
  });
});
