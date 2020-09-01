import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeModalComponent } from './unsubscribe-modal.component';
import { UserService } from '../../core/user/user.service';
import { Observable, of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { CUSTOM_REASON, MOCK_USER, MOCK_UNSUBSCRIBE_REASONS, SELECTED_REASON } from '../../../tests/user.fixtures.spec';
import { EventService } from '../../core/event/event.service';
import { environment } from '../../../environments/environment';
import { AccessTokenService } from '../../core/http/access-token.service';

describe('UnsubscribeModalComponent', () => {
  let component: UnsubscribeModalComponent;
  let fixture: ComponentFixture<UnsubscribeModalComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;
  let accessTokenService: AccessTokenService;
  let event: EventService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnsubscribeModalComponent],
      providers: [
        {
          provide: UserService, useValue: {
            getUnsubscribeReasons() {
              return of(MOCK_UNSUBSCRIBE_REASONS);
            },
            unsubscribe() {
              return of({});
            },
            isProUser() {
              return of(false);
            }
          }
        },
        {
          provide: NgbActiveModal, useValue: {
            close() {
            }
        }
        },
        {
          provide: AccessTokenService, useValue: {
          deleteAccessToken() {
          }
        }
        },
        {
          provide: EventService, useValue: {
            emit() {
            }
        }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

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

      component.ngOnInit();

      expect(userService.getUnsubscribeReasons).toHaveBeenCalled();
      expect(component.reasons).toEqual(MOCK_UNSUBSCRIBE_REASONS);
    });

    it('should show warning if user is pro', () => {
      spyOn(userService, 'isProUser').and.returnValue(of(true));

      component.ngOnInit();

      expect(userService.isProUser).toHaveBeenCalled();
      expect(component.hasSubscription).toBe(true);
    });

    it('should show normal message if user is not pro', () => {
      spyOn(userService, 'isProUser').and.returnValue(of(false));

      component.ngOnInit();

      expect(userService.isProUser).toHaveBeenCalled();
      expect(component.hasSubscription).toBe(false);

    })
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
      expect(event.emit).toHaveBeenCalledWith(EventService.USER_LOGOUT, environment.siteUrl);
    });
  });
});
