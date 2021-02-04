import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SocialShareComponent } from './social-share.component';
import { SocialShareService } from '@core/social-share/social-share.service';
import { DebugElement } from '@angular/core';
import { SvgIconModule } from '@core/svg-icon/svg-icon.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FacebookShare } from './interfaces/facebook-share.interface';
import { TwitterShare } from './interfaces/twitter-share.interface';
import { EmailShare } from './interfaces/email-share.interface';

describe('SocialShareComponent', () => {
  let component: SocialShareComponent;
  let fixture: ComponentFixture<SocialShareComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let socialShareService: SocialShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SocialShareComponent],
      imports: [SvgIconModule, HttpClientTestingModule],
      providers: [
        {
          provide: SocialShareService,
          useValue: {
            twitterShare() {},
            facebookShare() {},
            emailShare() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    socialShareService = TestBed.inject(SocialShareService);
    fixture = TestBed.createComponent(SocialShareComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('When component inits', () => {
    const facebookIconSelector = '[src*="facebook"]';
    const twitterIconSelector = '[src*="twitter"]';
    const emailIconSelector = '[src*="email"]';

    describe('When any data is passed', () => {
      it('should be created', () => {
        expect(component).toBeTruthy();
      });
      it('should not show any content', () => {
        expect(el.querySelector(facebookIconSelector)).toBeFalsy();
        expect(el.querySelector(twitterIconSelector)).toBeFalsy();
        expect(el.querySelector(emailIconSelector)).toBeFalsy();
      });
    });

    describe('When facebook data is passed', () => {
      const facebookData: FacebookShare = {
        url: 'url',
      };
      let facebookIconElement: HTMLElement = null;

      beforeEach(() => {
        component.facebook = facebookData;
        fixture.detectChanges();
        facebookIconElement = el.querySelector(facebookIconSelector);
      });

      it('should show share facebook icon', () => {
        expect(el.querySelector(facebookIconSelector)).toBeTruthy();
      });

      it('should share on facebook on click', () => {
        spyOn(socialShareService, 'facebookShare');

        facebookIconElement.click();

        expect(socialShareService.facebookShare).toBeCalledWith(component.facebook.url);
      });
    });

    describe('When twitter data is passed', () => {
      const twitterData: TwitterShare = {
        url: 'url',
        text: 'text',
      };
      let twitterIconElement: HTMLElement = null;

      beforeEach(() => {
        component.twitter = twitterData;
        fixture.detectChanges();
        twitterIconElement = el.querySelector(twitterIconSelector);
      });

      it('should show share twitter icon', () => {
        expect(el.querySelector(twitterIconSelector)).toBeTruthy();
      });

      it('should share on twitter on click', () => {
        spyOn(socialShareService, 'twitterShare');

        twitterIconElement.click();

        expect(socialShareService.twitterShare).toBeCalledWith(component.twitter.url, component.twitter.text);
      });
    });

    describe('When email data is passed', () => {
      const emailData: EmailShare = {
        url: 'url',
        subject: 'subject',
        message: 'message',
      };
      let emailIconElement: HTMLElement = null;

      beforeEach(() => {
        component.email = emailData;
        fixture.detectChanges();
        emailIconElement = el.querySelector(emailIconSelector);
      });

      it('should show share email icon', () => {
        expect(el.querySelector(emailIconSelector)).toBeTruthy();
      });

      it('should share on email on click', () => {
        spyOn(socialShareService, 'emailShare');

        emailIconElement.click();

        expect(socialShareService.emailShare).toBeCalledWith(component.email.url, component.email.subject, component.email.message);
      });
    });
  });
});
