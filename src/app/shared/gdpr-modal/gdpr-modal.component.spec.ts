import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { GdprModalComponent } from './gdpr-modal.component';
import { HttpService } from '../../core/http/http.service';
import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { PrivacyService } from '../../core/privacy/privacy.service';
import {
  MOCK_PRIVACY_UPDATE_ALLOW,
  MOCK_PRIVACY_UPDATE_DISALLOW,
  MOCK_PRIVACY_UPDATE_GDPR_ALLOW
} from '../../core/privacy/privacy.fixtures.spec';
import { TrackingService } from '../../core/tracking/tracking.service';
import { MockTrackingService } from '../../../tests/tracking.fixtures.spec';

describe('GdprModalComponent', () => {
  let component: GdprModalComponent;
  let fixture: ComponentFixture<GdprModalComponent>;
  let de: DebugElement;
  let el: HTMLElement;
  let http: HttpService;
  let privacyService: PrivacyService;
  let activeModal: NgbActiveModal;
  let trackingService: TrackingService;

  const MOCK_HTTP_SERVICE = {
    getNoBase() {
      return Observable.of(new Response(new ResponseOptions({body: 'text'})));
    }
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GdprModalComponent ],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        NgbActiveModal,
        PrivacyService,
        {
          provide: HttpService,
          useValue: MOCK_HTTP_SERVICE
        },
        {provide: TrackingService, useClass: MockTrackingService}
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdprModalComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    http = TestBed.get(HttpService);
    privacyService = TestBed.get(PrivacyService);
    activeModal = TestBed.get(NgbActiveModal);
    trackingService = TestBed.get(TrackingService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should call getGDPRText', () => {
      spyOn(component, 'getGDPRText')

      component.ngOnInit();

      expect(component.getGDPRText).toHaveBeenCalled();
    });

    it('should track GDPR display modal', () => {
      spyOn(trackingService, 'track');

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.GDPR_UNDEFINED_DISPLAY_FIRST_MODAL);
    });
  });

  describe('getGDPRText', () => {
    beforeEach(() => {
      spyOn(http, 'getNoBase').and.callThrough();
    });

    it('should get spanish text by default ', () => {
      const url = environment.siteUrl + 'rest/gdpr/popup/es';

      component.getGDPRText();

      expect(http.getNoBase).toHaveBeenCalledWith(url);
    });

    it('should get spanish text by default ', () => {
      const url = environment.siteUrl + 'rest/gdpr/popup/gb';
      spyOn<any>(component, 'getSubdomain').and.returnValue('web-en');

      component.getGDPRText();

      expect(http.getNoBase).toHaveBeenCalledWith(url);
    });
  });

  describe('setGRPRPermission', () => {
    it('should call updatePrivacy with gdpr_display and privacy_policy false', () => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());

      component.allowSegmentation = false;
      component.acceptPrivacy = false;

      component.setGRPRPermission();

      expect(privacyService.updatePrivacy).toHaveBeenCalledWith(MOCK_PRIVACY_UPDATE_DISALLOW);
    });

    it('should call updatePrivacy with gdpr_display and privacy_policy true', () => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());

      component.allowSegmentation = true;
      component.acceptPrivacy = true;

      component.setGRPRPermission();

      expect(privacyService.updatePrivacy).toHaveBeenCalledWith(MOCK_PRIVACY_UPDATE_ALLOW);
    });

    it('should close modal when allowSegmentation is false', () => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());
      spyOn(activeModal, 'close');
      component.allowSegmentation = true;

      component.setGRPRPermission();

      expect(activeModal.close).toHaveBeenCalled();
    });

    it('should show gdpr second screen when showSecondGdrpScreen is true', fakeAsync(() => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());
      component.showSecondGdrpScreen = true;

      fixture.detectChanges();
      tick();

      const element = el.querySelector('.gdpr-second-modal');
      expect(element).toBeDefined();
    }));

    it('should hide gdpr second screen when showSecondGdrpScreen is true', fakeAsync(() => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());
      component.showSecondGdrpScreen = false;

      component.setGRPRPermission();
      tick();

      const element = el.querySelector('.gdpr-second-modal');
      expect(element).toBeNull();
    }));

    it('should track GDPR Accept first modal ', fakeAsync(() => {
      spyOn(trackingService, 'track');
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());
      component.showSecondGdrpScreen = false;

      component.setGRPRPermission();
      tick();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.GDPR_ACCEPT_TAP_FIRST_MODAL, {
        AcceptedGDPR: component.allowSegmentation,
        AcceptedPrivacyPolicy: component.acceptPrivacy
      });
    }));

    it('should track GDPR display second modal', fakeAsync(() => {
      spyOn(trackingService, 'track');
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());
      component.allowSegmentation = false;
      component.acceptPrivacy = true;

      component.setGRPRPermission();
      tick();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.GDPR_UNDEFINED_DISPLAY_SECOND_MODAL);
    }));
  });

  describe('acceptAllowSegmentation', () => {
    it('should close modal', () => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());
      spyOn(activeModal, 'close')

      component.acceptAllowSegmentation();

      expect(activeModal.close).toHaveBeenCalled();
    });

    it('should call updatePrivacy', () => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());

      component.acceptAllowSegmentation();

      expect(privacyService.updatePrivacy).toHaveBeenCalledWith(MOCK_PRIVACY_UPDATE_GDPR_ALLOW);
    });

    it('should track GDPR accept second modal', () => {
      spyOn(trackingService, 'track');
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());

      component.acceptAllowSegmentation();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.GDPR_ACCEPT_TAP_SECOND_MODAL);
    });
  });
});
