import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { SITE_URL } from '@configs/site-url.config';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { APP_PATHS } from 'app/app-routing-constants';
import { HomeRouteDirective } from './home-route.directive';

@Component({
  template: `<div tslHomeRoute></div>`,
})
class TestComponent {
  constructor() {}
}

describe('HomeRouteDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let standaloneService: StandaloneService;
  let window: Window;
  let standalone: boolean = true;
  let router: Router;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [HomeRouteDirective, TestComponent],
        providers: [
          {
            provide: StandaloneService,
            useValue: {
              standalone,
            },
          },
          {
            provide: SITE_URL,
            useValue: MOCK_SITE_URL,
          },
          {
            provide: WINDOW_TOKEN,
            useValue: {
              open() {},
            },
          },
          {
            provide: Router,
            useValue: {
              navigate() {},
            },
          },
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    standaloneService = TestBed.inject(StandaloneService);
    router = TestBed.inject(Router);
    window = TestBed.inject(WINDOW_TOKEN);
  });

  describe('when standalone mode is enabled', () => {
    describe('and clicking on the element', () => {
      it('should redirect to the search page', () => {
        spyOn(router, 'navigate');
        spyOn(window, 'open');
        const testElement = fixture.debugElement.query(By.css('div')).nativeElement;

        testElement.click();

        expect(router.navigate).toHaveBeenLastCalledWith([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.SEARCH}`]);
        expect(window.open).not.toHaveBeenCalled();
      });
    });
  });
  describe('when standalone mode is disabled', () => {
    beforeAll(() => {
      standalone = false;
    });

    describe('and clicking on the element', () => {
      it('should redirect to the home page (SEO web)', () => {
        spyOn(window, 'open');
        spyOn(router, 'navigate');
        const testElement = fixture.debugElement.query(By.css('div')).nativeElement;

        testElement.click();

        expect(window.open).toHaveBeenCalledWith(MOCK_SITE_URL, '_self');
        expect(router.navigate).not.toHaveBeenCalled();
      });
    });
  });
});
