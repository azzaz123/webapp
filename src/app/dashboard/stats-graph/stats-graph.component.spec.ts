
import {of as observableOf,  Observable } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsGraphComponent } from './stats-graph.component';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { StatisticsService } from './statistics.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { STATISTICS_RESPONSE } from '../../../tests/statistics.fixtures.spec';

describe('StatsGraphComponent', () => {
  let component: StatsGraphComponent;
  let fixture: ComponentFixture<StatsGraphComponent>;
  let statisticsService: StatisticsService;
  let AmCharts: AmChartsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatsGraphComponent],
      providers: [{
        provide: AmChartsService, useValue: {
          makeChart() {},
          destroyChart() {}
        }
      },
        {
          provide: StatisticsService, useValue: {
          getStatistics() {
            return observableOf(STATISTICS_RESPONSE);
          }
        }
        },
        {
          provide: I18nService, useValue: {
          getTranslations() {
          }
        }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    statisticsService = TestBed.get(StatisticsService);
    AmCharts = TestBed.get(AmChartsService);
  });

  describe('ngOnInit', () => {
    it('should call getStatistics and push them to dataProvider', () => {
      spyOn(statisticsService, 'getStatistics').and.callThrough();

      component.ngOnInit();

      expect(statisticsService.getStatistics).toHaveBeenCalledWith('30');
      expect(component['chartOptions'].dataProvider.length).toBe(STATISTICS_RESPONSE.entries.length);
    });
  });

  describe('onStatsPeriodChange', () => {
    it('should call loadStats', () => {
      spyOn<any>(component, 'loadStats');

      component.onStatsPeriodChange();

      expect(component['loadStats']).toHaveBeenCalled();
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
