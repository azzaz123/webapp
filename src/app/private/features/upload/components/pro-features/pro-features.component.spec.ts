import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DropdownModule } from '@shared/dropdown/dropdown.module';
import { ToggleFormModule } from '@shared/form/components/toggle/toggle-form.module';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { DEBOUNCE_TIME, ProFeaturesComponent } from './pro-features.component';

describe('ProFeaturesComponent', () => {
  let component: ProFeaturesComponent;
  let fixture: ComponentFixture<ProFeaturesComponent>;
  let analitycsService: AnalyticsService;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProFeaturesComponent],
      imports: [ReactiveFormsModule, FormsModule, ToggleFormModule, DropdownModule],
      providers: [
        {
          provide: NgbModal,
          useValue: {
            open() {
              return {
                componentInstance: {},
                result: Promise.resolve('success'),
              };
            },
          },
        },
        { provide: AnalyticsService, useClass: MockAnalyticsService },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProFeaturesComponent);
    component = fixture.componentInstance;
    analitycsService = TestBed.inject(AnalyticsService);
    modalService = TestBed.inject(NgbModal);
    component.categoryId = '1';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should init default values', () => {
    expect(component.proFeaturesForm.getRawValue()).toEqual({
      configuration: false,
      installation: false,
      warranty: false,
      warrantyAmount: null,
      warrantyPeriod: 'months',
    });
  });

  describe('Submit', () => {
    beforeEach(() => {
      spyOn(analitycsService, 'trackEvent').and.callThrough();
    });
    describe('and the user click on submit', () => {
      beforeEach(() => {
        component.trackSubmit();
      });

      it('should emit event', () => {
        const { installation, configuration, warranty } = component.proFeaturesForm.getRawValue();
        const expectedEvent = {
          attributes: { categoryId: 1, screenId: SCREEN_IDS.Upload, installation, configuration, warranty },
          eventType: ANALYTIC_EVENT_TYPES.Navigation,
          name: ANALYTICS_EVENT_NAMES.ClickConfirmAdditionalServicesUpload,
        };

        expect(analitycsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
        expect(analitycsService.trackEvent).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('and the user click on intallation', () => {
    let oldValue: boolean;

    beforeEach(() => {
      spyOn(analitycsService, 'trackEvent').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      oldValue = component.proFeaturesForm.get('installation').value;

      const instalationSwitch: HTMLElement = fixture.debugElement.query(
        By.css('tsl-toggle-form[formControlname="installation"]')
      ).nativeElement;
      instalationSwitch.querySelector('input').click();
    });
    it('Should emit event', () => {
      const expectedEvent = {
        attributes: { categoryId: 1, screenId: SCREEN_IDS.Upload, switchOn: component.proFeaturesForm.get('installation').value },
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        name: ANALYTICS_EVENT_NAMES.ClickInstallationAdditionalServicesUpload,
      };

      expect(analitycsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      expect(analitycsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('Should change value', () => {
      expect(component.proFeaturesForm.get('installation').value).toBe(!oldValue);
    });

    it('Should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
        windowClass: 'pro-modal',
      });
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('and the user click on configuration', () => {
    let oldValue: boolean;

    beforeEach(() => {
      spyOn(analitycsService, 'trackEvent').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      oldValue = component.proFeaturesForm.get('configuration').value;

      const configurationSwitch: HTMLElement = fixture.debugElement.query(
        By.css('tsl-toggle-form[formControlname="configuration"]')
      ).nativeElement;
      configurationSwitch.querySelector('input').click();
    });
    it('Should emit event', () => {
      const expectedEvent = {
        attributes: { categoryId: 1, screenId: SCREEN_IDS.Upload, switchOn: component.proFeaturesForm.get('configuration').value },
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        name: ANALYTICS_EVENT_NAMES.ClickConfigurationAdditionalServicesUpload,
      };

      expect(analitycsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      expect(analitycsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('Should change value', () => {
      expect(component.proFeaturesForm.get('configuration').value).toBe(!oldValue);
    });

    it('Should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
        windowClass: 'pro-modal',
      });
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });

  describe('and the user click on warranty', () => {
    let oldValue: boolean;

    beforeEach(() => {
      spyOn(analitycsService, 'trackEvent').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      oldValue = component.proFeaturesForm.get('warranty').value;

      const warrantySwitch: HTMLElement = fixture.debugElement.query(By.css('tsl-toggle-form[formControlname="warranty"]')).nativeElement;
      warrantySwitch.querySelector('input').click();

      fixture.detectChanges();
    });

    it('Should change value', () => {
      expect(component.proFeaturesForm.get('warranty').value).toBe(!oldValue);
    });

    it('Should emit event', () => {
      const expectedEvent = {
        attributes: { categoryId: 1, screenId: SCREEN_IDS.Upload, switchOn: component.proFeaturesForm.get('warranty').value },
        eventType: ANALYTIC_EVENT_TYPES.Navigation,
        name: ANALYTICS_EVENT_NAMES.ClickWarrantyAdditionalServicesUpload,
      };

      expect(analitycsService.trackEvent).toHaveBeenCalledWith(expectedEvent);
      expect(analitycsService.trackEvent).toHaveBeenCalledTimes(1);
    });

    it('Should show warranty fields', () => {
      const warrantyAmount: HTMLElement = fixture.debugElement.query(By.css('input[formControlname="warrantyAmount"]')).nativeElement;
      const warrantyPeriod: HTMLElement = fixture.debugElement.query(
        By.css('tsl-dropdown[formControlname="warrantyPeriod"]')
      ).nativeElement;

      expect(warrantyAmount).toBeTruthy();
      expect(warrantyPeriod).toBeTruthy();
    });
    describe('and the user write an amount', () => {
      it('Should open modal', fakeAsync(() => {
        const input = fixture.debugElement.query(By.css('input[formControlname="warrantyAmount"]'));
        input.nativeElement.dispatchEvent(new Event('input'));

        tick(DEBOUNCE_TIME);

        expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
          windowClass: 'pro-modal',
        });
        expect(modalService.open).toHaveBeenCalledTimes(1);
      }));
    });
  });
});
