import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DailyStatsGraphComponent } from './daily-stats-graph.component';

describe('DailyStatsGraphComponent', () => {
  let component: DailyStatsGraphComponent;
  let fixture: ComponentFixture<DailyStatsGraphComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DailyStatsGraphComponent ]
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
