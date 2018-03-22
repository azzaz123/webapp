import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { BumpConfirmationModalComponent } from './bump-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MockBackend, MockConnection } from '@angular/http/testing';
import { Response, ResponseOptions} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';
import { MOCK_USER, USER_DATA } from '../../../../../tests/user.fixtures.spec';

let component: BumpConfirmationModalComponent;
let fixture: ComponentFixture<BumpConfirmationModalComponent>;
let trackingService: TrackingService;
let userService: UserService;

describe('BumpConfirmationModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
        declarations: [BumpConfirmationModalComponent],
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
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
    });
    fixture = TestBed.createComponent(BumpConfirmationModalComponent);
    component = fixture.componentInstance;
    trackingService = TestBed.get(TrackingService);
    userService = TestBed.get(UserService);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
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
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.FEATURED_PURCHASE_SUCCESS);
    });
    it('should send event featured_purchase_error if code != 200', () => {
      component.code = '-1';
      component.ngOnInit();
      expect(trackingService.track).toHaveBeenCalledWith(TrackingService.FEATURED_PURCHASE_ERROR, { error_code: component.code });
    });
  });

});
