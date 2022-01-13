import { ItemRouteDirective } from './item-route.directive';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ComponentFixture, waitForAsync, TestBed } from '@angular/core/testing';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { By } from '@angular/platform-browser';
import { WINDOW_TOKEN } from '@core/window/window.token';

const BUTTON: string = 'button';

@Component({
  template: `<button tslItemRoute [itemSlug]="item.webSlug" [itemUUID]="item.id"></button>`,
})
class TestComponent {
  item: ItemCard;
  constructor() {}
}

describe('ItemRouteDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let standaloneService: StandaloneService;
  let router: Router;
  let window: Window;
  let standalone: boolean = true;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ItemRouteDirective, TestComponent],
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
    window = TestBed.inject(WINDOW_TOKEN);
    component.item = MOCK_ITEM_CARD;
    router = TestBed.inject(Router);
  });

  it('should create an instance', () => {
    expect(component).toBeTruthy();
  });

  describe('when a click is triggered on an item', () => {
    describe('and the app is on standalone mode', () => {
      beforeEach(() => {
        fixture.detectChanges();
        spyOn(router, 'navigate');
      });

      it('should navigate to the item without opening a new tab', () => {
        const expectedUrl: string = `${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM_CARD.id}`;
        const testButton = fixture.debugElement.query(By.css(BUTTON)).nativeElement;

        testButton.click();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });

    describe('and the app is NOT on standalone mode', () => {
      beforeAll(() => {
        standalone = false;
      });

      beforeEach(() => {
        fixture.detectChanges();
        spyOn(window, 'open');
      });

      it('should navigate to the item in a new tab', () => {
        const expectedUrl: string = `${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM_CARD.webSlug}`;
        const testButton = fixture.debugElement.query(By.css(BUTTON)).nativeElement;

        testButton.click();

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(expectedUrl);
      });
    });
  });
});
