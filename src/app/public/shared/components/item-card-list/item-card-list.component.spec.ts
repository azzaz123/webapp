import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { AccessTokenService } from '@core/http/access-token.service';
import { UserService } from '@core/user/user.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { IsCurrentUserStub } from '@fixtures/public/core';
import { ItemApiModule } from '@public/core/services/api/item/item-api.module';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { ItemCardComponent } from '@public/shared/components/item-card/item-card.component';
import { ItemCardModule } from '@public/shared/components/item-card/item-card.module';
import { APP_PATHS } from 'app/app-routing-constants';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemCardListComponent } from './item-card-list.component';

describe('ItemCardListComponent', () => {
  let component: ItemCardListComponent;
  let fixture: ComponentFixture<ItemCardListComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let deviceDetectorService: DeviceDetectorService;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardListComponent, IsCurrentUserStub],
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
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    component.items = [MOCK_ITEM, MOCK_ITEM, MOCK_ITEM, MOCK_ITEM];
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  describe('when component inits', () => {
    const cardSelector = 'tsl-public-item-card';
    const cardShowDescriptionAttr = 'ng-reflect-show-description';

    it('should show as many cards as given', () => {
      expect(el.querySelectorAll(cardSelector).length).toEqual(component.items.length);
    });

    describe('when device is mobile', () => {
      it('should NOT show card descriptions if device is mobile', () => {
        const randomCardWithoutDescription = el.querySelectorAll(cardSelector)[0].getAttribute(cardShowDescriptionAttr) === 'false';
        expect(randomCardWithoutDescription).toBeTruthy();
      });
    });

    describe('when device is NOT mobile', () => {
      beforeEach(() => {
        spyOn(deviceDetectorService, 'isMobile').and.returnValue(false);
        fixture = TestBed.createComponent(ItemCardListComponent);
        component = fixture.componentInstance;
        de = fixture.debugElement;
        el = de.nativeElement;
        component.items = [MOCK_ITEM, MOCK_ITEM, MOCK_ITEM, MOCK_ITEM];
        fixture.detectChanges();
      });

      it('should show card descriptions', () => {
        const randomCardWithDescription = el.querySelectorAll(cardSelector)[0].getAttribute(cardShowDescriptionAttr) === 'true';

        expect(randomCardWithDescription).toBeTruthy();
      });
    });
  });

  describe('when we click on a item card...', () => {
    it('should redirect to the item view ', () => {
      spyOn(router, 'navigate');
      const itemCard: ItemCardComponent = de.query(By.directive(ItemCardComponent)).componentInstance;

      itemCard.itemClick.emit();
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith([`${APP_PATHS.PUBLIC}/${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM.id}`]);
    });
  });
});
