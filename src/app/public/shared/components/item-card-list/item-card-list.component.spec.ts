import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccessTokenService } from '@core/http/access-token.service';
import { FeatureflagService } from '@core/user/featureflag.service';
import { UserService } from '@core/user/user.service';
import { environment } from '@environments/environment';
import { FeatureFlagServiceMock } from '@fixtures/feature-flag.fixtures.spec';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { IsCurrentUserStub } from '@fixtures/public/core';
import { ItemCard } from '@public/core/interfaces/item-card.interface';
import { ItemApiModule } from '@public/core/services/api/item/item-api.module';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { MOCK_ITEM_INDEX } from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { ItemCardModule } from '@public/shared/components/item-card/item-card.module';
import { APP_PATHS } from 'app/app-routing-constants';
import { DeviceDetectorService } from 'ngx-device-detector';
import { NgxPermissionsModule } from 'ngx-permissions';
import { CARD_TYPES } from './enums/card-types.enum';
import { SlotsConfig } from './interfaces/slots-config.interface';
import { ItemCardListComponent } from './item-card-list.component';
import { ShowSlotPipe } from './pipes/show-slot.pipe';

@Component({
  selector: 'tsl-item-card-list-wrapper',
  template: `
    <tsl-public-item-card-list [showPlaceholder]="showPlaceholder" [items]="items" [cardType]="cardType" [slotsConfig]="slotConfig">
      <ng-template #slotTemplate let-index>
        <div class="adSlot">ad-{{ index }}</div>
      </ng-template>
    </tsl-public-item-card-list>
  `,
})
export class ItemCardListWrapperComponent {
  private static DEFAULT_NUMBER_OF_PLACEHOLDER_CARDS = 15;

  items: ItemCard[] = [MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD];
  slotConfig: SlotsConfig = {
    start: 1,
    offset: 2,
  };
  cardType: CARD_TYPES = CARD_TYPES.REGULAR;
  showPlaceholder = false;
  placeholderCards = ItemCardListWrapperComponent.DEFAULT_NUMBER_OF_PLACEHOLDER_CARDS;
}

describe('ItemCardListComponent', () => {
  const cardSelector = 'tsl-public-item-card';
  let component: ItemCardListComponent;
  let fixture: ComponentFixture<ItemCardListComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let deviceDetectorService: DeviceDetectorService;
  let router: Router;
  let checkSessionService: CheckSessionService;
  let itemCardService: ItemCardService;
  let featureFlagService: FeatureFlagServiceMock;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardListComponent, IsCurrentUserStub, ShowSlotPipe, ItemCardListWrapperComponent],
      imports: [CommonModule, ItemCardModule, ItemApiModule, HttpClientTestingModule, NgxPermissionsModule.forRoot()],
      providers: [
        ItemCardService,
        CheckSessionService,
        {
          provide: UserService,
          useValue: {
            user: {},
          },
        },
        {
          provide: AccessTokenService,
          useValue: {
            accessToken: 'ACCESS_TOKEN',
          },
        },
        {
          provide: DeviceDetectorService,
          useValue: {
            isMobile() {
              return true;
            },
          },
        },
        {
          provide: FeatureflagService,
          useClass: FeatureFlagServiceMock,
        },
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
        { provide: 'SUBDOMAIN', useValue: 'www' },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    component.items = [MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD, MOCK_ITEM_CARD];
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    checkSessionService = TestBed.inject(CheckSessionService);
    itemCardService = TestBed.inject(ItemCardService);
    router = TestBed.inject(Router);
    featureFlagService = TestBed.inject(FeatureflagService);
    fixture.detectChanges();
  });

  describe('when component inits', () => {
    it('should show as many cards as given', () => {
      expect(el.querySelectorAll(cardSelector).length).toEqual(component.items.length);
    });
  });

  describe('when we favourite the item...', () => {
    describe('and we have session...', () => {
      beforeEach(() => {
        spyOn(itemCardService, 'toggleFavourite');
        spyOn(checkSessionService, 'hasSession').and.returnValue(true);
      });
      it('should toggle the favourite item', () => {
        component.toggleFavourite(MOCK_ITEM_CARD);

        expect(itemCardService.toggleFavourite).toHaveBeenCalledWith(MOCK_ITEM_CARD);
      });

      it('should emit the itemCard data', () => {
        spyOn(component.toggleFavouriteEvent, 'emit');

        component.toggleFavourite(MOCK_ITEM_CARD);

        expect(component.toggleFavouriteEvent.emit).toHaveBeenCalledWith(MOCK_ITEM_CARD);
      });
    });
    describe(`and we don't have session...`, () => {
      beforeEach(() => {
        spyOn(checkSessionService, 'checkSessionAction');
        spyOn(checkSessionService, 'hasSession').and.returnValue(false);
      });
      it('should check the session action', () => {
        component.toggleFavourite(MOCK_ITEM_CARD);

        expect(checkSessionService.checkSessionAction).toHaveBeenCalled();
      });

      it('should not emit the itemCard data', () => {
        spyOn(component.toggleFavouriteEvent, 'emit');

        component.toggleFavourite(MOCK_ITEM_CARD);

        expect(component.toggleFavouriteEvent.emit).not.toHaveBeenCalled();
      });
    });
  });
  describe('when we click on a item card...', () => {
    describe('and the experimental features flag is enabled', () => {
      it('should redirect to the item view ', () => {
        spyOn(router, 'navigate');
        spyOn(featureFlagService, 'isExperimentalFeaturesEnabled').and.returnValue(true);
        spyOn(component.clickedItemAndIndex, 'emit');
        const itemCard: HTMLElement = de.queryAll(By.css(cardSelector))[MOCK_ITEM_INDEX].nativeElement;

        itemCard.click();
        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM.id}`]);
      });
    });

    describe('and the experimental features flag is not enabled', () => {
      it('should redirect to the item view ', () => {
        spyOn(window, 'open');
        spyOn(featureFlagService, 'isExperimentalFeaturesEnabled').and.returnValue(false);
        spyOn(component.clickedItemAndIndex, 'emit');
        const expectedURL = `${environment.siteUrl.replace('es', 'www')}item/${MOCK_ITEM_CARD.webSlug}`;
        const itemCard: HTMLElement = de.queryAll(By.css(cardSelector))[MOCK_ITEM_INDEX].nativeElement;

        itemCard.click();
        fixture.detectChanges();

        expect(window.open).toHaveBeenCalledWith(expectedURL);
        expect(component.clickedItemAndIndex.emit).toHaveBeenCalledWith({ itemCard: MOCK_ITEM_CARD, index: MOCK_ITEM_INDEX });
      });
    });
  });

  describe('when we have ads slots', () => {
    let componentWrapper: ItemCardListWrapperComponent;
    let fixtureWrapper: ComponentFixture<ItemCardListWrapperComponent>;
    beforeEach(() => {
      fixtureWrapper = TestBed.createComponent(ItemCardListWrapperComponent);
      componentWrapper = fixtureWrapper.componentInstance;
    });

    it('should project the template', () => {
      fixtureWrapper.detectChanges();

      const adSlotList = fixtureWrapper.debugElement.queryAll(By.css('.adSlot'));

      expect(adSlotList.length).toBe(2);
    });

    it('should project the template with index', () => {
      const slotConfig: SlotsConfig = componentWrapper.slotConfig;
      fixtureWrapper.detectChanges();

      const adSlotList = fixtureWrapper.debugElement.queryAll(By.css('.adSlot'));

      adSlotList.forEach((adSlot, index) => {
        expect(adSlot.nativeElement.textContent).toBe('ad-' + (slotConfig.start + index * slotConfig.offset));
      });
    });
  });

  describe('when having a wide acards configuration', () => {
    let component: ItemCardListWrapperComponent;
    let fixture: ComponentFixture<ItemCardListWrapperComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ItemCardListWrapperComponent);
      component = fixture.componentInstance;
    });

    it('should show wide cards', () => {
      component.cardType = CARD_TYPES.WIDE;
      component.items = [MOCK_ITEM_CARD];

      fixture.detectChanges();
      const wideItemCardElement = fixture.debugElement.query(By.css('tsl-item-card-wide'));
      const regularItemCardElement = fixture.debugElement.query(By.css('tsl-public-item-card'));

      expect(wideItemCardElement).toBeTruthy();
      expect(regularItemCardElement).toBeFalsy();
    });
  });

  describe('when having a regular cards configuration', () => {
    let component: ItemCardListWrapperComponent;
    let fixture: ComponentFixture<ItemCardListWrapperComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ItemCardListWrapperComponent);
      component = fixture.componentInstance;
    });

    it('should show regular cards', () => {
      component.cardType = CARD_TYPES.REGULAR;
      component.items = [MOCK_ITEM_CARD];

      fixture.detectChanges();
      const regularItemCardElement = fixture.debugElement.query(By.css('tsl-public-item-card'));
      const wideItemCardElement = fixture.debugElement.query(By.css('tsl-item-card-wide'));

      expect(regularItemCardElement).toBeTruthy();
      expect(wideItemCardElement).toBeFalsy();
    });
  });

  describe('when the property for showing the placeholder is active', () => {
    let component: ItemCardListWrapperComponent;
    let fixture: ComponentFixture<ItemCardListWrapperComponent>;

    beforeEach(() => {
      fixture = TestBed.createComponent(ItemCardListWrapperComponent);
      component = fixture.componentInstance;
    });

    describe('and the type of card is wide', () => {
      it('should show 15 wide empty cards', () => {
        component.cardType = CARD_TYPES.WIDE;
        component.showPlaceholder = true;

        fixture.detectChanges();
        const regularItemCardPlaceholders = fixture.debugElement.queryAll(By.css('tsl-item-card-wide-placeholder'));

        expect(regularItemCardPlaceholders.length).toBe(component.placeholderCards);
      });
    });
    describe('and the type of card is regular', () => {
      it('should show 15 regular empty cards', () => {
        component.cardType = CARD_TYPES.REGULAR;
        component.showPlaceholder = true;

        fixture.detectChanges();
        const regularItemCardPlaceholders = fixture.debugElement.queryAll(By.css('tsl-item-card-placeholder'));

        expect(regularItemCardPlaceholders.length).toBe(component.placeholderCards);
      });
    });
  });
});
