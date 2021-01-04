import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ItemCardModule } from '../item-card/item-card.module';
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
      imports: [CommonModule, ItemCardModule, HttpClientTestingModule],
      providers: [
        DeviceDetectorService,
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
        expect(
          el
            .querySelectorAll(cardSelector)[0]
            .getAttribute(cardShowDescriptionAttr) === 'false'
        ).toBeTruthy();
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
        expect(
          el
            .querySelectorAll(cardSelector)[0]
            .getAttribute(cardShowDescriptionAttr) === 'true'
        ).toBeTruthy();
      });
    });
  });
});
