import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { ANALYTICS_EVENT_NAMES, ANALYTIC_EVENT_TYPES, SCREEN_IDS } from '@core/analytics/analytics-constants';
import { AnalyticsService } from '@core/analytics/analytics.service';
import { MockAnalyticsService } from '@fixtures/analytics.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ProModalComponent } from '@shared/modals/pro-modal/pro-modal.component';
import { SwitchModule } from '@shared/switch/switch.module';
import { ProFeaturesComponent } from './pro-features.component';

describe('ProFeaturesComponent', () => {
  let component: ProFeaturesComponent;
  let fixture: ComponentFixture<ProFeaturesComponent>;
  let analitycsService: AnalyticsService;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProFeaturesComponent],
      imports: [ReactiveFormsModule, FormsModule, SwitchModule],
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
    expect(component.proFeaturesForm.getRawValue()).toEqual({ configuration: false, installation: false, warranty: false });
  });

  describe('Submit', () => {
    beforeEach(() => {
      spyOn(analitycsService, 'trackEvent').and.callThrough();
    });
    describe('and the user click on submit', () => {
      beforeEach(() => {
        component.clickSave = true;
        component.ngOnChanges();
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
    describe('and the user not click on submit', () => {
      beforeEach(() => {
        component.clickSave = false;
        component.ngOnChanges();
      });

      it('should not emit event', () => {
        expect(analitycsService.trackEvent).not.toHaveBeenCalled();
      });
    });
  });

  describe('and the user click on intallation', () => {
    let oldValue: boolean;

    beforeEach(() => {
      spyOn(analitycsService, 'trackEvent').and.callThrough();
      spyOn(modalService, 'open').and.callThrough();
      oldValue = component.proFeaturesForm.get('installation').value;

      const instalationSwitch: HTMLElement = fixture.debugElement.query(By.css('tsl-switch[formControlname="installation"]')).nativeElement;
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

      const instalationSwitch: HTMLElement = fixture.debugElement.query(By.css('tsl-switch[formControlname="configuration"]'))
        .nativeElement;
      instalationSwitch.querySelector('input').click();
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

      const instalationSwitch: HTMLElement = fixture.debugElement.query(By.css('tsl-switch[formControlname="warranty"]')).nativeElement;
      instalationSwitch.querySelector('input').click();
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

    it('Should change value', () => {
      expect(component.proFeaturesForm.get('warranty').value).toBe(!oldValue);
    });

    it('Should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(ProModalComponent, {
        windowClass: 'pro-modal',
      });
      expect(modalService.open).toHaveBeenCalledTimes(1);
    });
  });
});
