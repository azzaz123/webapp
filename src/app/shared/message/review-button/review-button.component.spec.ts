import * as _ from 'lodash';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReviewButtonComponent } from './review-button.component';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReviewModalComponent } from '../../../shared/modals/review-modal/review-modal.component';
import { ReviewService } from '../../../core/review/review.service';
import { MOCK_USER, USER_ID } from '../../../../tests/user.fixtures.spec';
import { ConversationService } from '../../../core/conversation/conversation.service';
import { ITEM_ID, MOCK_ITEM } from '../../../../tests/item.fixtures.spec';
import { UserService } from '../../../core/user/user.service';
import { MOCK_MESSAGE } from '../../../../tests/message.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../../tests/conversation.fixtures.spec';
import { SoldModalComponent } from '../../modals/sold-modal/sold-modal.component';
import { ConversationUser } from '../../../core/item/item-response.interface';

const conv = MOCK_CONVERSATION();

describe('ReviewButtonComponent', () => {
  let component: ReviewButtonComponent;
  let fixture: ComponentFixture<ReviewButtonComponent>;
  let reviewService: ReviewService;
  let modalService: NgbModal;
  const modalRef: any = {
    result: Promise.resolve({
      score: 4,
      comments: 'comment',
      userId: USER_ID
    }),
    componentInstance: {}
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewButtonComponent ],
      providers: [
        {
          provide: ConversationService, useValue: {
          getItemFromConvId() {
            return MOCK_ITEM;
          },
          get() {
            return Observable.of(conv);
           }
        }
        },
        {
          provide: ReviewService, useValue: {
          check() {
            return Observable.of(true);
          },
          createAsBuyer() {
            return Observable.of({});
          }
        }
        },
        {
          provide: UserService, useValue: {
            user: MOCK_USER
        }
        },
        {
          provide: NgbModal, useValue: {
          open() {
            return modalRef;
          }
        }
        }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewButtonComponent);
    component = fixture.componentInstance;
    component.message = MOCK_MESSAGE;
    fixture.detectChanges();
    reviewService = TestBed.get(ReviewService);
    modalService = TestBed.get(NgbModal);
  });

  describe('ngOnInit', () => {
    it('should set item', () => {
      component.ngOnInit();
      expect(component['item']).toEqual(MOCK_ITEM);
    });
    it('should set storageKey', () => {
      component.ngOnInit();
      expect(component['storageKey']).toEqual(USER_ID + '.item.' + ITEM_ID + '.reviewed');
    });
    describe('has local storage', () => {
      it('should set show button false without calling check', () => {
        spyOn(localStorage, 'getItem').and.returnValue(true);
        spyOn(reviewService, 'check');
        component.ngOnInit();
        expect(reviewService.check).not.toHaveBeenCalled();
        expect(component.showButton).toBeFalsy();
      });
    });
    describe('does NOT have local storage', () => {
      it('should set show button false and call check', () => {
        spyOn(localStorage, 'getItem').and.returnValue(undefined);
        spyOn(localStorage, 'setItem');
        spyOn(reviewService, 'check').and.returnValue(Observable.of(true));
        component.ngOnInit();
        expect(reviewService.check).toHaveBeenCalledWith(ITEM_ID);
        expect(component.showButton).toBeFalsy();
        expect(localStorage.setItem).toHaveBeenCalledWith(USER_ID + '.item.' + ITEM_ID + '.reviewed', 'true');
      });
      it('should set show button true and call check', () => {
        spyOn(localStorage, 'getItem').and.returnValue(undefined);
        spyOn(reviewService, 'check').and.returnValue(Observable.of(false));
        component.ngOnInit();
        expect(reviewService.check).toHaveBeenCalledWith(ITEM_ID);
        expect(component.showButton).toBeTruthy();
      });
    });
  });

  describe('openDialog', () => {
    const expectedConversationsUser: ConversationUser = {
      id: conv.user.id,
      micro_name: conv.user.microName,
      last_message: _.last(conv.messages.filter(msg => msg.from === conv.user.id)),
      image: conv.user.image
    };

    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(localStorage, 'setItem');
    });

    describe('as buyer', () => {
      beforeEach(fakeAsync(() => {
        component['isSeller'] = false;
        component.openDialog();
        tick();
      }));

      it('should open the ReviewModalComponent', () => {
        expect(modalService.open).toHaveBeenCalledWith(ReviewModalComponent, {windowClass: 'review'});
      });

      it('should set item in the modal component', () => {
        expect(modalRef.componentInstance.item).toEqual(MOCK_ITEM);
      });

      it('should set userToReview in the modal component', () => {
        expect(modalRef.componentInstance.userToReview).toEqual(expectedConversationsUser);
      });

      it('should set thread in the modal component', () => {
        expect(modalRef.componentInstance.thread).toEqual(component.message.conversationId);
      });

      it('should set showButton false', () => {
        expect(component.showButton).toBe(false);
      });

      it('should set local storage', () => {
        expect(localStorage.setItem).toHaveBeenCalledWith(USER_ID + '.item.' + ITEM_ID + '.reviewed', 'true');
      });
    });

    describe('as seller', () => {
      beforeEach(fakeAsync(() => {
        component['isSeller'] = true;
        component.openDialog();
        tick();
      }));

      it('should open the SoldModalComponent', fakeAsync(() => {
        expect(modalService.open).toHaveBeenCalledWith(SoldModalComponent, {windowClass: 'review'});
      }));

      it('should set item in the modal component', () => {
        expect(modalRef.componentInstance.item).toEqual(MOCK_ITEM);
      });

      it('should set userToReview in the modal component', () => {
        expect(modalRef.componentInstance.userToReview).toEqual(expectedConversationsUser);
      });

      it('should set isSeller to true in the modal component', () => {
        expect(modalRef.componentInstance.isSeller).toBe(true);
      });

      it('should set canChooseBuyer to false in the modal component', () => {
        expect(modalRef.componentInstance.canChooseBuyer).toBe(false);
      });

      it('should set showButton false', () => {
        expect(component.showButton).toBe(false);
      });
    });
  });
});
