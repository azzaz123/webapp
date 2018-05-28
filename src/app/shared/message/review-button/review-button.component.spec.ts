import { async, ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReviewButtonComponent } from './review-button.component';
import { Observable } from 'rxjs/Observable';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ReviewModalComponent } from '../../../shared/modals/review-modal/review-modal.component';
import { ReviewService } from '../../../core/review/review.service';
import { MOCK_USER, USER_ID } from '../../../../tests/user.fixtures.spec';
import { ConversationService } from '../../../core/conversation/conversation.service';
import { ITEM_ID, MOCK_ITEM } from '../../../../tests/item.fixtures.spec';
import { UserService } from '../../../core/user/user.service';
import { MOCK_MESSAGE } from '../../../../tests/message.fixtures.spec';
import { REVIEW_DATA_BUYER } from '../../../../tests/review.fixtures.spec';

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

  it('should be created', () => {
    expect(component).toBeTruthy();
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
    beforeEach(fakeAsync(() => {
      spyOn(modalService, 'open').and.callThrough();
      spyOn(reviewService, 'createAsBuyer').and.callThrough();
      spyOn(localStorage, 'setItem');
      component.openDialog();
      tick();
    }));
    it('should call open', () => {
      expect(modalService.open).toHaveBeenCalledWith(ReviewModalComponent, {windowClass: 'review'});
    });
    it('should set item in the modal component', () => {
      expect(modalRef.componentInstance.item).toEqual(MOCK_ITEM);
    });
    it('should call createAsBuyer', () => {
      expect(reviewService.createAsBuyer).toHaveBeenCalledWith(REVIEW_DATA_BUYER);
    });
    it('should set showButton false', () => {
      expect(component.showButton).toBeFalsy();
    });
    it('should set local storage', () => {
      expect(localStorage.setItem).toHaveBeenCalledWith(USER_ID + '.item.' + ITEM_ID + '.reviewed', 'true');
    });
  });
});
