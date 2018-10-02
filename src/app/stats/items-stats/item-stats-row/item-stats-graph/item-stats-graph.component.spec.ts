import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemStatsGraphComponent } from './item-stats-graph.component';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_ITEM_V3 } from '../../../../../tests/item.fixtures.spec';
import { I18nService } from '../../../../core/i18n/i18n.service';
import { ITEM_STATISTIC_RESPONSE } from '../../../../../tests/statistics.fixtures.spec';

describe('ItemStatsGraphComponent', () => {
  let component: ItemStatsGraphComponent;
  let fixture: ComponentFixture<ItemStatsGraphComponent>;
  let AmCharts: AmChartsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ItemStatsGraphComponent ],
      providers: [
        I18nService,
        {
          provide: AmChartsService, useValue: {
          makeChart() {
          },
          destroyChart() {
          }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemStatsGraphComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM_V3;
    component.statsData = {
      entries: []
    };
    AmCharts = TestBed.get(AmChartsService);
    fixture.detectChanges();
  });

  describe('ngAfterViewInit', () => {
    it('should call getStatistics and push them to dataProvider', () => {
      component.statsData = ITEM_STATISTIC_RESPONSE;

      component.ngAfterViewInit();

      expect(component['chartOptions'].dataProvider.length).toBe(ITEM_STATISTIC_RESPONSE.entries.length);
    });
  });

  describe('ngOnDestroy', () => {
    it('should call destroyChart', () => {
      const CHART = {chart: 'chart'};
      spyOn(AmCharts, 'destroyChart');
      component['chart'] = CHART;

      component.ngOnDestroy();

      expect(AmCharts.destroyChart).toHaveBeenCalledWith(CHART);
    });
  });
});
