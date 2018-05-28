import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStatsGraphComponent } from './daily-stats-graph.component';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { StatisticsService } from './statistics.service';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('DailyStatsGraphComponent', () => {
  let component: DailyStatsGraphComponent;
  let fixture: ComponentFixture<DailyStatsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DailyStatsGraphComponent],
      providers: [{
        provide: AmChartsService, useValue: {}
      },
        {
          provide: StatisticsService, useValue: {
          getStatistics() {
            return Observable.of();
          }
        }
        }],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DailyStatsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
