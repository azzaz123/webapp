import { of } from 'rxjs';
import { fakeAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProBumpConfirmationModalComponent } from './pro-bump-confirmation-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TrackingService } from '../../../../core/tracking/tracking.service';
import { UserService } from '../../../../core/user/user.service';
import { MockTrackingService } from '../../../../../tests/tracking.fixtures.spec';
import { MOCK_USER } from '../../../../../tests/user.fixtures.spec';
import { environment } from 'environments/environment';

let component: ProBumpConfirmationModalComponent;
let fixture: ComponentFixture<ProBumpConfirmationModalComponent>;
let trackingService: TrackingService;
let userService: UserService;

describe('BumpConfirmationModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ProBumpConfirmationModalComponent],
      providers: [
        NgbActiveModal,
        { provide: TrackingService, useClass: MockTrackingService },
        {
          provide: UserService,
          useValue: {
            me() {
              return of(MOCK_USER);
            },
          },
        },
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    });
    fixture = TestBed.createComponent(ProBumpConfirmationModalComponent);
    component = fixture.componentInstance;
    trackingService = TestBed.inject(TrackingService);
    userService = TestBed.inject(UserService);
    appboy.initialize(environment.appboy);
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    beforeEach(fakeAsync(() => {
      spyOn(trackingService, 'track');
    }));

    it('should send event featured_purchase_success if code == 200', () => {
      component.code = '200';

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.PRO_FEATURED_PURCHASE_SUCCESS
      );
    });

    it('should send event featured_purchase_success if code == 201', () => {
      component.code = '201';

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.PRO_FEATURED_PURCHASE_SUCCESS
      );
    });

    it('should send event featured_purchase_error if code != 200', () => {
      component.code = '-1';

      component.ngOnInit();

      expect(trackingService.track).toHaveBeenCalledWith(
        TrackingService.PRO_FEATURED_PURCHASE_ERROR
      );
    });

    it('should send appboy VisibilityPurchaseSuccess event if code == 200 or 201', () => {
      spyOn(appboy, 'logCustomEvent');
      component.code = '200';

      component.ngOnInit();

      expect(
        appboy.logCustomEvent
      ).toHaveBeenCalledWith('VisibilityPurchaseSuccess', { platform: 'web' });
    });
  });
});
