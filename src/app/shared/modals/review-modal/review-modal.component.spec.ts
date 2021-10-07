import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ReviewModalComponent } from './review-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CONVERSATION_USERS, ITEM_ID, MOCK_ITEM } from '@fixtures/item.fixtures.spec';
import { ReviewService } from '@core/review/review.service';
import { ItemService } from '@core/item/item.service';
import { MOCKED_CONVERSATIONS } from '@fixtures/chat';

describe('ReviewModalComponent', () => {
  let component: ReviewModalComponent;
  let fixture: ComponentFixture<ReviewModalComponent>;
  let activeModal: NgbActiveModal;
  let reviewService: ReviewService;
  let itemService: ItemService;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [ReviewModalComponent],
        providers: [
          {
            provide: ItemService,
            useValue: {
              getConversationUsers() {
                return of(CONVERSATION_USERS);
              },
              soldOutside() {
                return of({});
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
            provide: ReviewService,
            useValue: {
              createAsSeller() {
                return of([]);
              },
              createAsBuyer() {
                return of([]);
              },
            },
          },
        ],
        schemas: [NO_ERRORS_SCHEMA],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewModalComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    itemService = TestBed.inject(ItemService);
    activeModal = TestBed.inject(NgbActiveModal);
    reviewService = TestBed.inject(ReviewService);
    spyOn(itemService, 'getConversationUsers').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should set price', () => {
      expect(component.price).toBe(component.item.salePrice);
    });

    it('should set the userName when userToReview exists', () => {
      component.userToReview = CONVERSATION_USERS[0];

      component.ngOnInit();

      expect(component.userName).toBe(CONVERSATION_USERS[0].micro_name);
    });

    it('should NOT set the userName when userToReview does not exists', () => {
      component.userToReview = null;

      component.ngOnInit();

      expect(component.userName).toBeFalsy();
    });
  });

  describe('ngOnChanges', () => {
    it('should set the userName when userToReview exists', () => {
      component.userToReview = CONVERSATION_USERS[0];

      component.ngOnChanges();

      expect(component.userName).toEqual(CONVERSATION_USERS[0].micro_name);
    });

    it('should NOT set the userName when userToReview does not exists', () => {
      component.userToReview = null;

      component.ngOnChanges();

      expect(component.userName).toBeFalsy();
    });
  });

  describe('onRated', () => {
    it('should set score', () => {
      component.onRated(4);

      expect(component.score).toBe(4);
    });
  });

  describe('countChars', () => {
    beforeEach(() => {
      const testDe = fixture.debugElement;
      testDe.triggerEventHandler('keyup', {
        target: {
          value: 'some string here',
        },
      });
    });

    it('should set reviewCommentLength', () => {
      const fakeEvent = {
        target: {
          value: 'abc',
        },
      };

      component.countChars(fakeEvent);

      expect(component.reviewCommentLength).toBe(fakeEvent.target.value.length);
    });
  });

  describe('sumbitReview', () => {
    beforeEach(() => {
      component.userToReview = CONVERSATION_USERS[0];
      component.item = MOCK_ITEM;
      component.comments = 'comments';
      component.score = 4;
      component.price = 100;
    });

    it('should call createAsSeller when isSeller is true', () => {
      spyOn(reviewService, 'createAsSeller').and.callThrough();
      component.isSeller = true;

      component.sumbitReview();

      expect(reviewService.createAsSeller).toHaveBeenCalledWith({
        to_user_id: '1',
        item_id: ITEM_ID,
        comments: 'comments',
        score: 4 * 20,
        price: 100,
      });
    });

    it('should call emit a finishedReview event when isSeller is true', () => {
      let called = false;
      component.isSeller = true;
      component.finishedReview.subscribe(() => {
        called = true;
      });

      component.sumbitReview();

      expect(called).toBe(true);
    });

    it('should call createAsBuyer when isSeller is false', () => {
      spyOn(reviewService, 'createAsBuyer').and.callThrough();
      component.isSeller = false;
      component.thread = MOCKED_CONVERSATIONS[0].id;

      component.sumbitReview();

      expect(reviewService.createAsBuyer).toHaveBeenCalledWith({
        to_user_id: '1',
        item_id: ITEM_ID,
        comments: 'comments',
        score: 4 * 20,
        conversation_id: component.thread,
      });
    });

    it('should call close when isSeller is false', () => {
      spyOn(activeModal, 'close');
      component.isSeller = false;

      component.sumbitReview();

      expect(activeModal.close).toHaveBeenCalled();
    });
  });
});
