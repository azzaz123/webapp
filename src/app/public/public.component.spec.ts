import { CommonModule } from '@angular/common';
import { By } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { BehaviorSubject } from 'rxjs';
import { PublicFooterService } from './core/services/footer/public-footer.service';
import { PublicComponent } from './public.component';

describe('PublicComponent', () => {
  let component: PublicComponent;
  let fixture: ComponentFixture<PublicComponent>;
  let analyticsService: AnalyticsService;
  let publicFooterServiceMock;
  const showFooterSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  beforeEach(async () => {
    publicFooterServiceMock = {
      showFooter$: showFooterSubject.asObservable(),
    };
    await TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [PublicComponent],
      providers: [
        { provide: AnalyticsService, useClass: MockAnalyticsService },
        {
          provide: PublicFooterService,
          useValue: publicFooterServiceMock,
        },
      ],
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

  describe('showFooter', () => {
    it('should show footer when showFooter is true', () => {
      showFooterSubject.next(true);
      fixture.detectChanges();

      const footerElement: HTMLElement = fixture.debugElement.query(By.css('tsl-footer')).nativeElement;

      expect(footerElement).not.toBeNull();
    });
  });
});
