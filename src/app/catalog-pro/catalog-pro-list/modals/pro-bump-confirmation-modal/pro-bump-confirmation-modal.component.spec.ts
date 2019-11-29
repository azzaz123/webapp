import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ProBumpConfirmationModalComponent
} from './pro-bump-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions} from '@angular/http';
import { Observable } from 'rxjs';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';
import { MOCK_USER, USER_DATA } from '../../../../../tests/user.fixtures.spec';
import { SplitTestService, WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT } from '../../../../core/tracking/split-test.service';

let component: ProBumpConfirmationModalComponent;
let fixture: ComponentFixture<ProBumpConfirmationModalComponent>;
let trackingService: TrackingService;
let userService: UserService;
let splitTestService: SplitTestService;

describe('BumpConfirmationModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [ProBumpConfirmationModalComponent],
        providers: [
          NgbActiveModal,
          {provide: TrackingService, useClass: MockTrackingService},
          MockBackend,
          {
            provide: UserService, useValue: {
              me() {
                return Observable.of(MOCK_USER);
              }
            }
          },
          {
            provide: SplitTestService, useValue: {
              track() {}
            }
          },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(ProBumpConfirmationModalComponent);
    component = fixture.componentInstance;
    trackingService = TestBed.get(TrackingService);
    userService = TestBed.get(UserService);
    splitTestService = TestBed.get(SplitTestService);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(fakeAsync(() => {
      const mockBackend = TestBed.get(MockBackend);
      mockBackend.connections.subscribe((connection: MockConnection) => {
        const res: ResponseOptions = new ResponseOptions({body: JSON.stringify(USER_DATA)});
        connection.mockRespond(new Response(res));
      });
      spyOn(trackingService, 'track');
      spyOn(splitTestService, 'track');
    }));
    it('should send event featured_purchase_success if code == 200', () => {
      component.code = '200';

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRO_FEATURED_PURCHASE_SUCCESS);
    });

    it('should send event to taplytics if code == 200', () => {
      component.code = '200';

      component.ngOnInit();

      expect(splitTestService.track).toHaveBeenCalledWith(WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT);
    });

    it('should send event featured_purchase_success if code == 201', () => {
      component.code = '201';

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRO_FEATURED_PURCHASE_SUCCESS);
    });

    it('should send event to taplytics if code == 201', () => {
      component.code = '201';
      
      component.ngOnInit();

      expect(splitTestService.track).toHaveBeenCalledWith(WEB_PAYMENT_EXPERIMENT_SUCCESSFUL_EVENT);
    });

    it('should send event featured_purchase_error if code != 200', () => {
      component.code = '-1';

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.PRO_FEATURED_PURCHASE_ERROR);
    });
  });

});
