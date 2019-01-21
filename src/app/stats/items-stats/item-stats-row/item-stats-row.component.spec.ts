import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatsRowComponent } from './item-stats-row.component';
import { ItemStatsService } from './item-stats-graph/item-stats.service';
import { Observable } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CustomCurrencyPipe } from '../../../shared/custom-currency/custom-currency.pipe';
import { DecimalPipe } from '@angular/common';
import { MomentModule } from 'angular2-moment';
import {
  ITEM_CONVERSATIONS,
  ITEM_COUNTERS_DATA,
  ITEM_FAVORITES,
  ITEM_VIEWS,
  MOCK_ITEM_V3
} from '../../../../tests/item.fixtures.spec';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ItemService } from '../../../core/item/item.service';
import { ITEM_STATISTIC_RESPONSE } from '../../../../tests/statistics.fixtures.spec';
import { environment } from '../../../../environments/environment';

describe('ItemStatsRowComponent', () => {
  let component: ItemStatsRowComponent;
  let fixture: ComponentFixture<ItemStatsRowComponent>;
  let itemStatsService: ItemStatsService;
  let itemService: ItemService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [MomentModule, NoopAnimationsModule],
      declarations: [ ItemStatsRowComponent, CustomCurrencyPipe ],
      providers: [
        DecimalPipe,
        {
          provide: 'SUBDOMAIN', useValue: 'es'
        },
        {
          provide: ItemStatsService, useValue: {
          getStatistics() {
            return Observable.of(ITEM_STATISTIC_RESPONSE);
          }
        }
        },
        {
          provide: ItemService, useValue: {
          getCounters() {
            return Observable.of(ITEM_COUNTERS_DATA);
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatsRowComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM_V3;
    itemStatsService = TestBed.get(ItemStatsService);
    itemService = TestBed.get(ItemService);
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
      expect(component.statsData).toEqual(ITEM_STATISTIC_RESPONSE);
    });

    it('should call getCounters and set it', () => {
      spyOn(itemService, 'getCounters').and.callThrough();
      component.item.views = 0;
      component.item.favorites = 0;

      component.ngOnInit();

      expect(itemService.getCounters).toHaveBeenCalledWith(MOCK_ITEM_V3.id)
      expect(component.item.views).toBe(ITEM_VIEWS);
      expect(component.item.favorites).toBe(ITEM_FAVORITES);
      expect(component.item.conversations).toBe(ITEM_CONVERSATIONS);
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
