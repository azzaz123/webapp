import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { SITE_URL } from '@configs/site-url.config';
import { EventService } from '@core/event/event.service';
import { AccessTokenService } from '@core/http/access-token.service';
import { UserService } from '@core/user/user.service';
import { MOCK_SITE_URL } from '@fixtures/site-url.fixtures.spec';
import { CUSTOM_REASON, MOCK_UNSUBSCRIBE_REASONS, SELECTED_REASON } from '@fixtures/user.fixtures.spec';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { UnsubscribeModalComponent } from './unsubscribe-modal.component';

describe('UnsubscribeModalComponent', () => {
  let component: UnsubscribeModalComponent;
  let fixture: ComponentFixture<UnsubscribeModalComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;
  let accessTokenService: AccessTokenService;
  let event: EventService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [UnsubscribeModalComponent],
        providers: [
          {
            provide: UserService,
            useValue: {
              getUnsubscribeReasons() {
                return of(MOCK_UNSUBSCRIBE_REASONS);
              },
              unsubscribe() {
                return of({});
              },
              isProUser() {
                return false;
              },
              isProfessional() {
                return of(false);
              },
            },
          },
          {
            provide: NgbActiveModal,
            useValue: {
              close() {},
            },
          },
          {
            provide: AccessTokenService,
            useValue: {
              deleteAccessToken() {},
            },
          },
          {
            provide: EventService,
            useValue: {
              emit() {},
            },
          },
          {
            provide: SITE_URL,
            useValue: MOCK_SITE_URL,
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(UnsubscribeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    userService = TestBed.inject(UserService);
    activeModal = TestBed.inject(NgbActiveModal);
    accessTokenService = TestBed.inject(AccessTokenService);
    event = TestBed.inject(EventService);
  });

  describe('ngOnInit', () => {
    it('should call getUnsubscribeReasons and set reasons', () => {
      spyOn(userService, 'getUnsubscribeReasons').and.callThrough();
      spyOn(userService, 'isProfessional').and.callThrough();

      component.ngOnInit();

      expect(userService.getUnsubscribeReasons).toHaveBeenCalled();
      expect(component.reasons).toEqual(MOCK_UNSUBSCRIBE_REASONS);
    });

    it('should show warning if user is pro', () => {
      spyOn(userService, 'isProUser').and.returnValue(true);
      component.ngOnInit();
      fixture.detectChanges();

      const proDescription: HTMLElement = fixture.debugElement.query(By.css('.UnsubscribeModal__description--pro')).nativeElement;

      expect(userService.isProUser).toHaveBeenCalled();
      expect(component.isProUser).toBe(true);
      expect(proDescription).toBeTruthy();
    });

    it('should show an extra warning if user is car dealer', () => {
      spyOn(userService, 'isProfessional').and.returnValue(of(true));

      component.ngOnInit();
      fixture.detectChanges();

      const carDealerDescription: HTMLElement = fixture.debugElement.query(
        By.css('.UnsubscribeModal__description--professional')
      ).nativeElement;

      expect(carDealerDescription).toBeTruthy();
    });

    it('should show normal message if user is not pro', () => {
      spyOn(userService, 'isProUser').and.returnValue(false);
      const proDescription = fixture.debugElement.query(By.css('.UnsubscribeModal__description--pro'));

      component.ngOnInit();

      expect(userService.isProUser).toHaveBeenCalled();
      expect(component.isProUser).toBe(false);
      expect(proDescription).toBeFalsy();
    });
  });

  describe('send', () => {
    it('should call unsubscribe, deleteAccessToken and emit logout event', () => {
      spyOn(userService, 'unsubscribe').and.callThrough();
      spyOn(activeModal, 'close');
      spyOn(accessTokenService, 'deleteAccessToken');
      spyOn(event, 'emit');
      component.selectedReason = SELECTED_REASON;
      component.customReason = CUSTOM_REASON;

      component.send();

      expect(userService.unsubscribe).toHaveBeenCalledWith(SELECTED_REASON, CUSTOM_REASON);
      expect(activeModal.close).toHaveBeenCalled();
      expect(accessTokenService.deleteAccessToken).toHaveBeenCalled();
      expect(event.emit).toHaveBeenCalledWith(EventService.USER_LOGOUT, MOCK_SITE_URL);
    });
  });
});
