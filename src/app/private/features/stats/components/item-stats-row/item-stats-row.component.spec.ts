import { MOCK_ITEM_V3 } from '@fixtures/item.fixtures.spec';
import { ITEM_STATISTIC_RESPONSE } from '@fixtures/statistics.fixtures.spec';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ItemStatsRowComponent } from './item-stats-row.component';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { DecimalPipe, CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ItemService } from '@core/item/item.service';
import { CustomCurrencyPipe } from '@shared/pipes';
import { environment } from '@environments/environment';
import { ItemStatsService } from '../../core/services/item-stats.service';

describe('ItemStatsRowComponent', () => {
  let component: ItemStatsRowComponent;
  let fixture: ComponentFixture<ItemStatsRowComponent>;
  let itemStatsService: ItemStatsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [CommonModule, NoopAnimationsModule],
        declarations: [ItemStatsRowComponent, CustomCurrencyPipe],
        providers: [
          DecimalPipe,
          {
            provide: ItemStatsService,
            useValue: {
              getStatistics() {
                return of(ITEM_STATISTIC_RESPONSE);
              },
            },
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
  });

  describe('ngOnInit', () => {
    it('should set link', () => {
      expect(component.link).toBe(environment.siteUrl + 'item/toyota-yaris-1-3-99cv-500008657');
    });

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
});
