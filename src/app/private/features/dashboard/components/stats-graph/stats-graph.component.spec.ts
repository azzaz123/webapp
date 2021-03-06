import { STATISTICS_RESPONSE } from '@fixtures/statistics.fixtures.spec';
import { of } from 'rxjs';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { StatsGraphComponent } from './stats-graph.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { I18nService } from '@core/i18n/i18n.service';
import { StatisticsService } from '../../core/services/statistics.service';

describe('StatsGraphComponent', () => {
  let component: StatsGraphComponent;
  let fixture: ComponentFixture<StatsGraphComponent>;
  let statisticsService: StatisticsService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [StatsGraphComponent],
        providers: [
          {
            provide: StatisticsService,
            useValue: {
              getStatistics() {
                return of(STATISTICS_RESPONSE);
              },
            },
          },
          I18nService,
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(StatsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    statisticsService = TestBed.inject(StatisticsService);
  });

  describe('ngOnInit', () => {
    it('should call getStatistics and push them to dataProvider', () => {
      component.yearly = false;
      spyOn(statisticsService, 'getStatistics').and.callThrough();

      component.ngOnInit();

      expect(statisticsService.getStatistics).toHaveBeenCalledWith('30');
      expect(component.chartOption.series[1].data[0]).toBe(STATISTICS_RESPONSE.entries[0].values.country_bump);
    });
  });

  describe('onStatsPeriodChange', () => {
    it('should call loadStats', () => {
      spyOn<any>(component, 'loadStats');

      component.onStatsPeriodChange();

      expect(component['loadStats']).toHaveBeenCalled();
    });
  });
});
