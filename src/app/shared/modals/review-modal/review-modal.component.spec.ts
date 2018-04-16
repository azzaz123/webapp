import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewModalComponent } from './review-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { UserService } from '../../../core/user/user.service';
import { MOCK_USER, USER_ID } from '../../../../tests/user.fixtures.spec';
import { CONVERSATION_USERS, ITEM_ID, ITEM_SALE_PRICE, MOCK_ITEM } from '../../../../tests/item.fixtures.spec';
import { ReviewService } from '../../../core/review/review.service';
import { ItemService } from '../../../core/item/item.service';


describe('ReviewModalComponent', () => {
  let component: ReviewModalComponent;
  let fixture: ComponentFixture<ReviewModalComponent>;
  let activeModal: NgbActiveModal;
  let userService: UserService;
  let reviewService: ReviewService;
  let itemService: ItemService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewModalComponent ],
      providers: [
        {
          provide: ItemService, useValue: {
            getConversationUsers() {
              return Observable.of(CONVERSATION_USERS);
            },
            soldOutside() {
              return Observable.of({});
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
          provide: UserService, useValue: {
            get() {
              return Observable.of(MOCK_USER);
            }
          }
        },
        {
          provide: ReviewService, useValue: {
            createAsSeller() {
              return Observable.of([]);
            }
          }
        }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewModalComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    itemService = TestBed.get(ItemService);
    userService = TestBed.get(UserService);
    activeModal = TestBed.get(NgbActiveModal);
    reviewService = TestBed.get(ReviewService);
    spyOn(itemService, 'getConversationUsers').and.callThrough();
    fixture.detectChanges();
  });

  describe('ngOnInit', () => {
    it('should get and set the seller when isSeller is false', () => {
      spyOn(userService, 'get').and.callThrough();
      component.isSeller = false;

      component.ngOnInit();

      expect(userService.get).toHaveBeenCalledWith(USER_ID);
      expect(component.seller).toEqual(MOCK_USER);
    });

    it('should set the userName when isSeller is false', () => {
      component.isSeller = false;

      component.ngOnInit();

      expect(component.userName).toEqual(MOCK_USER.microName);
    });
  });

  describe('ngOnChanges', () => {
    it('should set the userName when buyer exists', () => {
      component.buyer = CONVERSATION_USERS[0];

      component.ngOnChanges();

      expect(component.userName).toEqual(CONVERSATION_USERS[0].micro_name);
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
          value: 'some string here'
        }
      });
    });

    it('should set reviewCommentLength', () => {
      const fakeTextArea = fixture.nativeElement.querySelector('textarea');
      const fakeEvent = {
        target: {
          value: 'abc'
        }
      };

      component.countChars(fakeEvent);

      expect(component.reviewCommentLength).toBe(fakeEvent.target.value.length);
    });
  });

  describe('sumbitReview', () => {
    beforeEach(() => {
      component.buyer = CONVERSATION_USERS[0];
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
        price: 100
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

    it('should call close when isSeller is false', () => {
      spyOn(activeModal, 'close');
      component.isSeller = false;

      component.sumbitReview();

      expect(activeModal.close).toHaveBeenCalledWith({
        score: 4,
        comments: 'comments',
        userId: USER_ID
      });
    });
  });
});
