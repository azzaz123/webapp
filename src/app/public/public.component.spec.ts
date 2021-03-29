import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';

import { PublicComponent } from './public.component';

describe('PublicComponent', () => {
  let component: PublicComponent;
  let fixture: ComponentFixture<PublicComponent>;
  let analyticsService: AnalyticsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PublicComponent],
      providers: [{ provide: AnalyticsService, useClass: MockAnalyticsService }],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublicComponent);
    component = fixture.componentInstance;
    analyticsService = TestBed.inject(AnalyticsService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Analytics', () => {
    it('should initialize the analytics library', () => {
      spyOn(analyticsService, 'initialize');

      component.ngOnInit();

      expect(analyticsService.initialize).toHaveBeenCalledTimes(1);
    });
  });
});
