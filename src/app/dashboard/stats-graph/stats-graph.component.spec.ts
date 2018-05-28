import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatsGraphComponent } from './stats-graph.component';
import { AmChartsService } from '@amcharts/amcharts3-angular';
import { StatisticsService } from './statistics.service';
import { Observable } from 'rxjs/Observable';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { I18nService } from '../../core/i18n/i18n.service';

describe('StatsGraphComponent', () => {
  let component: StatsGraphComponent;
  let fixture: ComponentFixture<StatsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatsGraphComponent],
      providers: [{
        provide: AmChartsService, useValue: {}
      },
        {
          provide: StatisticsService, useValue: {
          getStatistics() {
            return Observable.of();
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
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
