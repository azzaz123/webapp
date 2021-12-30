import { PUBLIC_PATHS } from '@public/public-routing-constants';
import { MOCK_ITEM_V3 } from '@fixtures/item.fixtures.spec';
import { ITEM_STATISTIC_RESPONSE } from '@fixtures/statistics.fixtures.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemStatsRowComponent } from './item-stats-row.component';
import { of, BehaviorSubject } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CustomCurrencyPipe } from '@shared/pipes';
import { ItemStatsService } from '../../core/services/item-stats.service';
import { SITE_URL } from '@configs/site-url.config';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { By } from '@angular/platform-browser';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '@shared/shared.module';
import { CoreModule } from '@core/core.module';
import { StandaloneService } from '@core/standalone/services/standalone.service';
import { Router } from '@angular/router';

describe('ItemStatsRowComponent', () => {
  let component: ItemStatsRowComponent;
  let fixture: ComponentFixture<ItemStatsRowComponent>;
  let itemStatsService: ItemStatsService;
  let router: Router;
  const standaloneSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [HttpClientTestingModule, RouterTestingModule, SharedModule, CoreModule, NoopAnimationsModule],
        declarations: [ItemStatsRowComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          {
            provide: StandaloneService,
            useValue: {
              standalone$: standaloneSubject.asObservable(),
            },
          },
          {
            provide: ItemStatsService,
            useValue: {
              getStatistics() {
                return of(ITEM_STATISTIC_RESPONSE);
              },
            },
          },
          {
            provide: SITE_URL,
            useValue: MOCK_SITE_URL,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatsRowComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM_V3;
    itemStatsService = TestBed.inject(ItemStatsService);
    fixture.detectChanges();
    router = TestBed.inject(Router);
  });

  describe('ngOnInit', () => {
    it('should call getStatistics and set it', () => {
      spyOn(itemStatsService, 'getStatistics').and.callThrough();

      component.ngOnInit();

      expect(itemStatsService.getStatistics).toHaveBeenCalledWith(MOCK_ITEM_V3.id);
    });

    it('should now show the current day stats', () => {
      let today = new Date();
      today.setUTCHours(0, 0, 0, 0);
      const ITEM_STATISTIC_RESPONSE_V2 = ITEM_STATISTIC_RESPONSE;
      ITEM_STATISTIC_RESPONSE_V2.entries.push({
        date: today.toString(),
        values: { favs: 95, views: 37, chats: 63 },
      });
      spyOn(itemStatsService, 'getStatistics').and.returnValue(of(ITEM_STATISTIC_RESPONSE_V2));

      component.ngOnInit();

      expect(component.statsData).toEqual(ITEM_STATISTIC_RESPONSE);
    });
  });

  describe('changeExpandedState', () => {
    it('should toggle open', () => {
      component.open = true;

      component.changeExpandedState();

      expect(component.open).toBe(false);

      component.changeExpandedState();

      expect(component.open).toBe(true);
    });

    it('should emit open event', () => {
      component.open = false;
      spyOn(component.onOpen, 'emit');

      component.changeExpandedState();

      expect(component.onOpen.emit).toHaveBeenCalledWith(true);
    });
  });

  describe('when a click is triggered on an item image', () => {
    describe('and the app is on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(true);
        spyOn(router, 'navigate');
      });
      it('should navigate to the item without opening a new tab', () => {
        const expectedUrl: string = `${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM_V3.id}`;
        const itemImage = fixture.debugElement.query(By.css('.image')).nativeElement;

        itemImage.click();

        expect(router.navigate).toHaveBeenCalledTimes(1);
        expect(router.navigate).toHaveBeenCalledWith([expectedUrl]);
      });
    });
    describe('and the app is NOT on standalone mode', () => {
      beforeEach(() => {
        standaloneSubject.next(false);
        spyOn(window, 'open');
      });
      it('should navigate to the item in a new tab', () => {
        const expectedUrl: string = `${MOCK_SITE_URL}${PUBLIC_PATHS.ITEM_DETAIL}/${MOCK_ITEM_V3.webSlug}`;
        const itemImage = fixture.debugElement.query(By.css('.image')).nativeElement;

        itemImage.click();

        expect(window.open).toHaveBeenCalledTimes(1);
        expect(window.open).toHaveBeenCalledWith(expectedUrl);
      });
    });
  });
});
