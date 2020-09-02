
import {of as observableOf } from 'rxjs';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsGraphComponent } from './stats-graph.component';
import { StatisticsService } from './statistics.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';
import { STATISTICS_RESPONSE } from '../../../tests/statistics.fixtures.spec';

describe('StatsGraphComponent', () => {
  let component: StatsGraphComponent;
  let fixture: ComponentFixture<StatsGraphComponent>;
  let statisticsService: StatisticsService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatsGraphComponent],
      providers: [
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
