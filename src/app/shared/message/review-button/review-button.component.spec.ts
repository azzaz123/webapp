import { last } from 'lodash-es';
import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReviewButtonComponent } from './review-button.component';
import { Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReviewModalComponent } from '../../../shared/modals/review-modal/review-modal.component';
import { ReviewService } from '../../../core/review/review.service';
import { MOCK_USER, USER_ID, OTHER_USER_ID } from '../../../../tests/user.fixtures.spec';
import { ConversationService } from '../../../core/conversation/conversation.service';
import { ITEM_ID, ITEM_LEGACY_ID } from '../../../../tests/item.fixtures.spec';
import { UserService } from '../../../core/user/user.service';
import { MOCK_MESSAGE } from '../../../../tests/message.fixtures.spec';
import { MOCK_CONVERSATION } from '../../../../tests/conversation.fixtures.spec';
import { SoldModalComponent } from '../../modals/sold-modal/sold-modal.component';
import { ConversationUser } from '../../../core/item/item-response.interface';
import { Item } from '../../../core/item/item';

const mockConversation = MOCK_CONVERSATION();
const mockItem = new Item(ITEM_ID, ITEM_LEGACY_ID, USER_ID);
const mockConversationsUser: ConversationUser = {
  id: mockConversation.user.id,
  micro_name: mockConversation.user.microName,
  last_message: last(mockConversation.messages.filter(msg => msg.from === mockConversation.user.id)),
  image: mockConversation.user.image
};

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
          getItemFromThread() {
            return mockItem;
          },
          get() {
            return Observable.of(mockConversation);
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

      expect(component['item']).toEqual(mockItem);
    });

    it('should set storageKey', () => {
      component.ngOnInit();

      expect(component['storageKey']).toEqual(`${USER_ID}.item.${mockItem.id}.reviewed`);
    });

    it('should set conversationUser', () => {
      component.ngOnInit();

      expect(component['conversationUser']).toEqual(mockConversationsUser);
    });

    it('should set isSeller to TRUE of the item.owner and conversationUser.id are different', () => {
      mockItem.owner = OTHER_USER_ID;

      component.ngOnInit();

      expect(component['isSeller']).toBe(true);
    });

    it('should set isSeller to FALSE of the item.owner and conversationUser.id are the same', () => {
      mockItem.owner = USER_ID;

      component.ngOnInit();

      expect(component['isSeller']).toBe(false);
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

        expect(reviewService.check).toHaveBeenCalledWith(mockItem.id);
        expect(component.showButton).toBeFalsy();
        expect(localStorage.setItem).toHaveBeenCalledWith(`${USER_ID}.item.${mockItem.id}.reviewed`, 'true');
      });

      it('should set show button true and call check', () => {
        spyOn(localStorage, 'getItem').and.returnValue(undefined);
        spyOn(reviewService, 'check').and.returnValue(Observable.of(false));

        component.ngOnInit();

        expect(reviewService.check).toHaveBeenCalledWith(mockItem.id);
        expect(component.showButton).toBeTruthy();
      });
    });
  });

  describe('openDialog', () => {
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
        expect(modalRef.componentInstance.item).toEqual(mockItem);
      });

      it('should set userToReview in the modal component', () => {
        expect(modalRef.componentInstance.userToReview).toEqual(mockConversationsUser);
      });

      it('should set thread in the modal component', () => {
        expect(modalRef.componentInstance.thread).toEqual(component.message.thread);
      });

      it('should set showButton false', () => {
        expect(component.showButton).toBe(false);
      });

      it('should set local storage', () => {
        expect(localStorage.setItem).toHaveBeenCalledWith(`${USER_ID}.item.${mockItem.id}.reviewed`, 'true');
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
        expect(modalRef.componentInstance.item).toEqual(mockItem);
      });

      it('should set userToReview in the modal component', () => {
        expect(modalRef.componentInstance.userToReview).toEqual(mockConversationsUser);
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
