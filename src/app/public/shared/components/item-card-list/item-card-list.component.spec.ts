import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccessTokenService } from '@core/http/access-token.service';
import { UserService } from '@core/user/user.service';
import { MOCK_ITEM_CARD } from '@fixtures/item-card.fixtures.spec';
import { environment } from '@environments/environment';
import { IsCurrentUserStub } from '@fixtures/public/core';
import { ItemApiModule } from '@public/core/services/api/item/item-api.module';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { MOCK_ITEM_INDEX } from '@public/features/item-detail/core/services/item-detail-track-events/track-events.fixtures.spec';
import { ItemCardModule } from '@public/shared/components/item-card/item-card.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemCardListComponent } from './item-card-list.component';
import { ShowSlotPipe } from './pipes/show-slot.pipe';

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

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardListComponent, IsCurrentUserStub, ShowSlotPipe],
      imports: [CommonModule, ItemCardModule, ItemApiModule, HttpClientTestingModule],
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
    fixture.detectChanges();
  });

  describe('when component inits', () => {
    it('should show as many cards as given', () => {
      expect(el.querySelectorAll(cardSelector).length).toEqual(component.items.length);
    });
  });

  describe('when we favourite the item...', () => {
    describe('and we have session...', () => {
      it('should toggle the favourite item', () => {
        spyOn(itemCardService, 'toggleFavourite');
        spyOn(checkSessionService, 'hasSession').and.returnValue(true);

        component.toggleFavourite(MOCK_ITEM_CARD);

        expect(itemCardService.toggleFavourite).toHaveBeenCalledWith(MOCK_ITEM_CARD);
      });
    });
    describe(`and we don't have session...`, () => {
      it('should check the session action', () => {
        spyOn(checkSessionService, 'checkSessionAction');
        spyOn(checkSessionService, 'hasSession').and.returnValue(false);

        component.toggleFavourite(MOCK_ITEM_CARD);

        expect(checkSessionService.checkSessionAction).toHaveBeenCalled();
      });
    });
  });
  describe('when we click on a item card...', () => {
    it('should redirect to the item view ', () => {
      // spyOn(router, 'navigate');
      spyOn(window, 'open');
      spyOn(component.clickedItemAndIndex, 'emit');
      const expectedURL = `${environment.siteUrl.replace('es', 'www')}item/${MOCK_ITEM_CARD.webSlug}`;
      const itemCard: HTMLElement = de.queryAll(By.css(cardSelector))[MOCK_ITEM_INDEX].nativeElement;

      itemCard.click();
      fixture.detectChanges();

      expect(window.open).toHaveBeenCalledWith(expectedURL);
      expect(component.clickedItemAndIndex.emit).toHaveBeenCalledWith({ itemCard: MOCK_ITEM_CARD, index: MOCK_ITEM_INDEX });
      // TODO: UNCOMMENT WHEN WE OPEN ITEM DETAIL IN PRODUCTION		Date: 2021/04/01
      // expect(router.navigate).toHaveBeenCalledWith([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM.id}`]);
    });
  });
});
