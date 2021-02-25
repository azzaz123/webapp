import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick, waitForAsync } from '@angular/core/testing';
import { ReviewService } from '@core/review/review.service';
import { InboxConversation } from '@private/features/chat/core/model';
import { CREATE_MOCK_INBOX_CONVERSATION } from '@fixtures/inbox.fixtures.spec';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ButtonComponent } from '@shared/button/button.component';
import { ReviewModalComponent } from '@shared/modals/review-modal/review-modal.component';
import { SoldModalComponent } from '@shared/modals/sold-modal/sold-modal.component';
import { of } from 'rxjs';
import { ThirdVoiceReviewButtonComponent } from './third-voice-review-button.component';

const modalRef: any = {
  result: Promise.resolve({
    score: 4,
    comments: 'comment',
    userId: USER_ID,
  }),
  componentInstance: {},
};

class NgbModalMock {
  open() {
    return modalRef;
  }
}

class ReviewServiceMock {
  check() {
    return of(true);
  }

  createAsBuyer() {
    return of({});
  }
}

describe('ThirdVoiceReviewComponent', () => {
  let component: ThirdVoiceReviewButtonComponent;
  let fixture: ComponentFixture<ThirdVoiceReviewButtonComponent>;
  let reviewService: ReviewService;
  let modalService: NgbModal;
  let mockConversation: InboxConversation;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [],
        declarations: [ThirdVoiceReviewButtonComponent, ButtonComponent],
        providers: [
          { provide: ReviewService, useClass: ReviewServiceMock },
          { provide: NgbModal, useClass: NgbModalMock },
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ThirdVoiceReviewButtonComponent);
    component = fixture.componentInstance;
    mockConversation = CREATE_MOCK_INBOX_CONVERSATION();
    component.message = mockConversation.messages[0];
    component.user = mockConversation.user;
    component.item = mockConversation.item;
    reviewService = TestBed.inject(ReviewService);
    modalService = TestBed.inject(NgbModal);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set initial value', () => {
      component.ngOnInit();
      expect(component.message).toEqual(mockConversation.messages[0]);
      expect(component.item).toEqual(mockConversation.item);
      expect(component.user).toEqual(mockConversation.user);
    });

    it('should get item with storageKey', () => {
      spyOn(localStorage, 'getItem');
      component.ngOnInit();
      expect(localStorage.getItem).toHaveBeenCalledWith(`${mockConversation.user.id}.item.${mockConversation.item.id}.reviewed`);
    });
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
      spyOn(reviewService, 'check').and.returnValue(of(true));

      component.ngOnInit();

      expect(reviewService.check).toHaveBeenCalledWith(mockConversation.item.id);
      expect(component.showButton).toBeFalsy();
      expect(localStorage.setItem).toHaveBeenCalledWith(`${mockConversation.user.id}.item.${mockConversation.item.id}.reviewed`, 'true');
    });

    it('should set show button true and call check', () => {
      spyOn(localStorage, 'getItem').and.returnValue(undefined);
      spyOn(reviewService, 'check').and.returnValue(of(false));

      component.ngOnInit();

      expect(reviewService.check).toHaveBeenCalledWith(mockConversation.item.id);
      expect(component.showButton).toBeTruthy();
    });
  });

  describe('openDialog', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(localStorage, 'setItem');
    });

    describe('as buyer', () => {
      beforeEach(fakeAsync(() => {
        component.item.isMine = false;
        component.openDialog();
        tick();
      }));

      it('should open the ReviewModalComponent', () => {
        expect(modalService.open).toHaveBeenCalledWith(ReviewModalComponent, {
          windowClass: 'review',
        });
      });

      it('should set item in the modal component', () => {
        expect(modalRef.componentInstance.item).toEqual(mockConversation.item);
      });

      it('should set userToReview in the modal component', () => {
        expect(modalRef.componentInstance.userToReview).toEqual({
          id: mockConversation.user.id,
          micro_name: mockConversation.user.microName,
        });
      });

      it('should set thread in the modal component', () => {
        expect(modalRef.componentInstance.thread).toEqual(component.message.thread);
      });

      it('should set showButton false', () => {
        expect(component.showButton).toBe(false);
      });

      it('should set local storage', () => {
        expect(localStorage.setItem).toHaveBeenCalledWith(`${mockConversation.user.id}.item.${mockConversation.item.id}.reviewed`, 'true');
      });
    });

    describe('as seller', () => {
      beforeEach(fakeAsync(() => {
        component.item.isMine = true;
        component.openDialog();
        tick();
      }));

      it('should open the SoldModalComponent', fakeAsync(() => {
        expect(modalService.open).toHaveBeenCalledWith(SoldModalComponent, {
          windowClass: 'review',
        });
      }));

      it('should set item in the modal component', () => {
        expect(modalRef.componentInstance.item).toEqual(mockConversation.item);
      });

      it('should set userToReview in the modal component', () => {
        expect(modalRef.componentInstance.userToReview).toEqual({
          id: mockConversation.user.id,
          micro_name: mockConversation.user.microName,
        });
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
