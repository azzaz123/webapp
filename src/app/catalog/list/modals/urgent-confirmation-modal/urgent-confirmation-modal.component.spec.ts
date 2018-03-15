import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrgentConfirmationModalComponent } from './urgent-confirmation-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WindowRef, MOCK_USER, MockTrackingService } from 'shield';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { Observable } from 'rxjs/Observable';

describe('UrgentConfirmationModalComponent', () => {
  let component: UrgentConfirmationModalComponent;
  let fixture: ComponentFixture<UrgentConfirmationModalComponent>;
  let activeModal: NgbActiveModal;
  let trackingService: TrackingService;
  let userService: UserService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UrgentConfirmationModalComponent ],
      providers: [
        WindowRef,
        NgbActiveModal,
        {provide: TrackingService, useClass: MockTrackingService},
        {
          provide: UserService, useValue: {
            me() {
              return Observable.of(MOCK_USER);
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrgentConfirmationModalComponent);
    activeModal = TestBed.get(NgbActiveModal);
    trackingService = TestBed.get(TrackingService);
    userService = TestBed.get(UserService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(fakeAsync(() => {
      spyOn(trackingService, 'track');
    }));
    it('should send event featured_purchase_success if code == 200', () => {
      component.code = '200';
      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.URGENT_PURCHASE_SUCCESS);
    });
    it('should send event featured_purchase_error if code != 200', () => {
      component.code = '-1';
      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.URGENT_PURCHASE_ERROR, { error_code: component.code });
    });
  });
});
