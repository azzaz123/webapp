import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Response, ResponseOptions } from '@angular/http';
import { GdprModalComponent } from './gdpr-modal.component';
import { HttpService } from '../../core/http/http.service';
import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from '../../../environments/environment';
import { PrivacyService } from '../../core/privacy/privacy.service';
import { PrivacyRequestData } from '../../core/privacy/privacy';

describe('GdprModalComponent', () => {
  let component: GdprModalComponent;
  let fixture: ComponentFixture<GdprModalComponent>;
  let http: HttpService;
  let privacyService: PrivacyService;
  let activeModal: NgbActiveModal;

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
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GdprModalComponent);
    component = fixture.componentInstance;
    http = TestBed.get(HttpService);
    privacyService = TestBed.get(PrivacyService);
    activeModal = TestBed.get(NgbActiveModal);
    fixture.detectChanges();
  });

  it('ngOnInit', () => {
    spyOn(component, 'getGDPRText')

    component.ngOnInit();

    expect(component.getGDPRText).toHaveBeenCalled();
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

      const permission = {
        ...new PrivacyRequestData('gdpr_display', '0', false),
        ...new PrivacyRequestData('privacy_policy', '0', false),
      };

      component.setGRPRPermission();

      expect(privacyService.updatePrivacy).toHaveBeenCalledWith(permission);
    });

    it('should call updatePrivacy with gdpr_display and privacy_policy true', () => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());

      component.allowSegmentation = true;
      component.acceptPrivacy = true;

      const permission = {
        ...new PrivacyRequestData('gdpr_display', '0', true),
        ...new PrivacyRequestData('privacy_policy', '0', true),
      };

      component.setGRPRPermission();

      expect(privacyService.updatePrivacy).toHaveBeenCalledWith(permission);
    });

    it('should close modal ', () => {
      spyOn(privacyService, 'updatePrivacy').and.returnValue(Observable.of());
      spyOn(activeModal, 'close');

      component.setGRPRPermission();

      expect(activeModal.close).toHaveBeenCalled();
    });
  });
});
