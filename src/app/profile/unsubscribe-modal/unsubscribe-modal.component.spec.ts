import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UnsubscribeModalComponent } from './unsubscribe-modal.component';
import { UserService } from '../../core/user/user.service';
import { Observable } from 'rxjs/Observable';
import { UnsubscribeReason } from '../../core/user/unsubscribe-reason.interface';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';

const REASONS: UnsubscribeReason[] = [{
  name: 'Test',
  reason_id: 1
}];

describe('UnsubscribeModalComponent', () => {
  let component: UnsubscribeModalComponent;
  let fixture: ComponentFixture<UnsubscribeModalComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UnsubscribeModalComponent],
      providers: [
        {
          provide: UserService, useValue: {
          getUnsubscribeReasons() {
            return Observable.of(REASONS);
          },
          unsubscribe() {
            return Observable.of({});
          },
          logout() {
          }
        }
        },
        {
          provide: NgbActiveModal, useValue: {
            close() {
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
    userService = TestBed.get(UserService);
    activeModal = TestBed.get(NgbActiveModal);
  });

  describe('ngOnInit', () => {
    it('should call getUnsubscribeReasons and set reasons', () => {
      spyOn(userService, 'getUnsubscribeReasons').and.callThrough();

      component.ngOnInit();

      expect(userService.getUnsubscribeReasons).toHaveBeenCalled();
      expect(component.reasons).toEqual(REASONS);
    });
  });

  describe('send', () => {

    const SELECTED_REASON = 1;
    const CUSTOM_REASON = 'bye';

    it('should call unsubscribe, close and logout', () => {
      spyOn(userService, 'unsubscribe').and.callThrough();
      spyOn(activeModal, 'close');
      spyOn(userService, 'logout');
      component.selectedReason = SELECTED_REASON;
      component.customReason = CUSTOM_REASON;

      component.send();

      expect(userService.unsubscribe).toHaveBeenCalledWith(SELECTED_REASON, CUSTOM_REASON);
      expect(activeModal.close).toHaveBeenCalled();
      expect(userService.logout).toHaveBeenCalled();
    });
  });
});
