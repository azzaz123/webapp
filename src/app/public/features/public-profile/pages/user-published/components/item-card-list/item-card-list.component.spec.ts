import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccessTokenService } from '@core/http/access-token.service';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ItemApiModule } from '@public/core/services/api/item/item-api.module';
import { CheckSessionService } from '@public/core/services/check-session/check-session.service';
import { ItemCardService } from '@public/core/services/item-card/item-card.service';
import { ItemCardModule } from '@public/shared/components/item-card/item-card.module';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemCardListComponent } from './item-card-list.component';

describe('ItemCardListComponent', () => {
  let component: ItemCardListComponent;
  let fixture: ComponentFixture<ItemCardListComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let deviceDetectorService: DeviceDetectorService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemCardListComponent],
      imports: [
        CommonModule,
        ItemCardModule,
        ItemApiModule,
        HttpClientTestingModule,
      ],
      providers: [
        ItemCardService,
        CheckSessionService,
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
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemCardListComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    component.items = [MOCK_ITEM, MOCK_ITEM, MOCK_ITEM, MOCK_ITEM];
    deviceDetectorService = TestBed.inject(DeviceDetectorService);
    fixture.detectChanges();
  });

  describe('when component inits', () => {
    const cardSelector = 'tsl-public-item-card';
    const cardShowDescriptionAttr = 'ng-reflect-show-description';

    it('should show as many cards as given', () => {
      expect(el.querySelectorAll(cardSelector).length).toEqual(
        component.items.length
      );
    });

    describe('when device is mobile', () => {
      it('should NOT show card descriptions if device is mobile', () => {
        const randomCardWithoutDescription =
          el
            .querySelectorAll(cardSelector)[0]
            .getAttribute(cardShowDescriptionAttr) === 'false';
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
        const randomCardWithDescription =
          el
            .querySelectorAll(cardSelector)[0]
            .getAttribute(cardShowDescriptionAttr) === 'true';

        expect(randomCardWithDescription).toBeTruthy();
      });
    });
  });
});
