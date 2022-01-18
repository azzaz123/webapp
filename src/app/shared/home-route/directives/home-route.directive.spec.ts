import { Component } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SITE_URL } from '@configs/site-url.config';
import { SearchNavigatorService } from '@core/search/search-navigator.service';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { WINDOW_TOKEN } from '@core/window/window.token';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
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
  let searchNavigatorService: SearchNavigatorService;
  let window: Window;
  let standalone: boolean = true;

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
            provide: SearchNavigatorService,
            useValue: {
              navigateWithLocationParams() {},
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
        ],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(TestComponent);
    component = fixture.componentInstance;
    standaloneService = TestBed.inject(StandaloneService);
    searchNavigatorService = TestBed.inject(SearchNavigatorService);
    window = TestBed.inject(WINDOW_TOKEN);
  });

  describe('when standalone mode is enabled', () => {
    describe('and clicking on the element', () => {
      it('should redirect to the search page', () => {
        spyOn(searchNavigatorService, 'navigateWithLocationParams');
        spyOn(window, 'open');
        const testElement = fixture.debugElement.query(By.css('div')).nativeElement;

        testElement.click();

        expect(searchNavigatorService.navigateWithLocationParams).toHaveBeenLastCalledWith({});
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
        spyOn(searchNavigatorService, 'navigateWithLocationParams');
        const testElement = fixture.debugElement.query(By.css('div')).nativeElement;

        testElement.click();

        expect(window.open).toHaveBeenCalledWith(MOCK_SITE_URL, '_self');
        expect(searchNavigatorService.navigateWithLocationParams).not.toHaveBeenLastCalledWith({});
      });
    });
  });
});
