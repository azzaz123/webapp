import { DecimalPipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { MockCookieService } from '@fixtures/cookies.fixtures.spec';
import { ItemApiService } from '@public/core/services/api/item/item-api.service';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { CustomCurrencyPipe } from '@shared/pipes';
import { CookieService } from 'ngx-cookie';
import { ItemFullScreenCarouselComponent } from './item-fullscreen-carousel.component';
import { MOCK_ITEM, MOCK_ITEM_GBP } from '@fixtures/item.fixtures.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ItemFullScreenCarouselComponent', () => {
  const parentContainer = '.ItemDetailImages';
  const backButtonClass = '.ItemHeader__backButton';
  const itemPriceClass = '.ItemHeader__price';
  const itemInfoClass = '.ItemInfo';
  const favouriteButtonId = '#favouriteButton';
  const currencies = {
    EUR: '€',
    GBP: '£',
  };

  let component: ItemFullScreenCarouselComponent;
  let fixture: ComponentFixture<ItemFullScreenCarouselComponent>;
  let itemCardService: ItemCardService;
  let checkSessionService: CheckSessionService;
  let decimalPipe: DecimalPipe;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemFullScreenCarouselComponent, CustomCurrencyPipe],
      imports: [HttpClientModule],
      providers: [
        {
          provide: CheckSessionService,
          useValue: {
            hasSession() {
              return true;
            },
            checkSessionAction() {},
          },
        },
        ItemCardService,
        ItemApiService,
        {
          provide: CookieService,
          useValue: MockCookieService,
        },
        DecimalPipe,
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemFullScreenCarouselComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    itemCardService = TestBed.inject(ItemCardService);
    checkSessionService = TestBed.inject(CheckSessionService);
    decimalPipe = TestBed.inject(DecimalPipe);
    el = fixture.debugElement.nativeElement;
    window.scrollTo = jest.fn();

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component is showing...', () => {
    beforeEach(() => {
      component.show();
      fixture.detectChanges();
    });

    describe('when we click on the back button...', () => {
      it('should hidde the component', () => {
        spyOn(component, 'hidde').and.callThrough();
        const backButton = fixture.debugElement.nativeElement.querySelector(backButtonClass);

        backButton.click();
        fixture.detectChanges();

        expect(component.hidden).toBe(true);
        expect(component.hidde).toHaveBeenCalled();
        expect(fixture.debugElement.query(By.css(parentContainer))).toBeFalsy();
      });
    });

    describe('when we clic on the chat button...', () => {
      it('should redirect to the item chat page', () => {
        const itemURL = `/chat`;
        const chatButton = fixture.debugElement.nativeElement.querySelector('.ChatButton');

        expect(chatButton.routerLink).toEqual([itemURL]);
        expect(chatButton.queryParams).toEqual({ itemId: component.item.id });
      });
    });

    describe('when we click on the favourite button...', () => {
      describe('and we have a current session...', () => {
        it('should toggle the favourite button', () => {
          spyOn(itemCardService, 'toggleFavourite');
          const favouriteButton = fixture.debugElement.nativeElement.querySelector(favouriteButtonId);

          favouriteButton.click();

          expect(itemCardService.toggleFavourite).toHaveBeenCalledWith(component.item);
        });
      });
      describe('and we NOT have a current session...', () => {
        it('should check the session action', () => {
          spyOn(checkSessionService, 'hasSession').and.returnValue(false);
          spyOn(checkSessionService, 'checkSessionAction');
          const favouriteButton = fixture.debugElement.nativeElement.querySelector(favouriteButtonId);

          favouriteButton.click();

          expect(checkSessionService.checkSessionAction).toHaveBeenCalled();
        });
      });
    });

    describe('when we have an item...', () => {
      it('should show the item title', () => {
        const infoItemLabels = fixture.debugElement.query(By.css(itemInfoClass)).queryAll(By.css('span'));

        expect(infoItemLabels.length).toBe(2);
        expect(infoItemLabels[0].nativeElement.innerHTML).toBe(component.item.title);
      });

      describe('when the item currency code is in euros...', () => {
        it('should show the price and the euros symbol', () => {
          expect(el.querySelector(itemPriceClass).innerHTML).toEqual(`${decimalPipe.transform(component.item.salePrice)}${currencies.EUR}`);
        });
      });

      describe('when the item currency code is in dollars...', () => {
        beforeEach(() => {
          component.item = MOCK_ITEM_GBP;
          fixture.detectChanges();
        });
        it('should show the price and the dollar symbol', () => {
          expect(el.querySelector(itemPriceClass).innerHTML).toEqual(`${currencies.GBP}${decimalPipe.transform(component.item.salePrice)}`);
        });
      });
    });
  });
});
