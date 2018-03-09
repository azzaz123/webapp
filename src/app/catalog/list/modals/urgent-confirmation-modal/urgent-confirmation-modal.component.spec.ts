import { async, fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrgentConfirmationModalComponent } from './urgent-confirmation-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { WindowRef, USER_DATA, MOCK_USER, MockTrackingService } from 'shield';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { Response, ResponseOptions} from '@angular/http';
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
        MockBackend,
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
      let mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((connection: MockConnection) => {
        let res: ResponseOptions = new ResponseOptions({body: JSON.stringify(USER_DATA)});
        connection.mockRespond(new Response(res));
      });
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
