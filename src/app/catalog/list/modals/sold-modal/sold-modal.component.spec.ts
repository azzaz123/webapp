import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SoldModalComponent } from './sold-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../../core/item/item.service';
import { Observable } from 'rxjs/Observable';
import { ReviewService, MOCK_ITEM, ITEM_SALE_PRICE, ITEM_ID, MOCK_USER, USER_ID } from 'shield';
import { CONVERSATION_USERS } from '../../../../../tests/item.fixtures';


describe('SoldModalComponent', () => {
  let component: SoldModalComponent;
  let fixture: ComponentFixture<SoldModalComponent>;
  let itemService: ItemService;
  let activeModal: NgbActiveModal;
  let reviewService: ReviewService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        NgbActiveModal,
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
          provide: ReviewService, useValue: {
          createAsSeller() {
            return Observable.of([]);
          }
        }
        }
      ],
      declarations: [SoldModalComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SoldModalComponent);
    component = fixture.componentInstance;
    component.item = MOCK_ITEM;
    itemService = TestBed.get(ItemService);
    activeModal = TestBed.get(NgbActiveModal);
    reviewService = TestBed.get(ReviewService);
    spyOn(itemService, 'getConversationUsers').and.callThrough();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set price', () => {
      expect(component.price).toBe(ITEM_SALE_PRICE);
    });
    it('should call getConversationUsers', () => {
      expect(itemService.getConversationUsers).toHaveBeenCalledWith(ITEM_ID);
    });
    it('should set conversationUsers', () => {
      expect(component.conversationUsers).toEqual(CONVERSATION_USERS);
    });
  });

  describe('chooseUser', () => {
    it('should set selectedUser', () => {
      component.chooseUser(CONVERSATION_USERS[0]);
      expect(component.selectedUser).toEqual(CONVERSATION_USERS[0]);
    });
  });

  describe('onRated', () => {
    it('should set score', () => {
      component.onRated(4);
      expect(component.score).toBe(4);
    });
  });

  describe('setSoldOutside', () => {
    it('should call soldOutside and close dialog', () => {
      spyOn(itemService, 'soldOutside').and.callThrough();
      component.setSoldOutside();
      expect(itemService.soldOutside).toHaveBeenCalledWith(ITEM_ID);
    });
    it('should close dialog', () => {
      spyOn(activeModal, 'close');
      component.setSoldOutside();
      expect(activeModal.close).toHaveBeenCalled();
    });
  });

  describe('setSold', () => {
    it('should call createAsSeller and set thanks true', () => {
      spyOn(reviewService, 'createAsSeller').and.callThrough();
      component.selectedUser = CONVERSATION_USERS[0];
      component.item = MOCK_ITEM;
      component.comments = 'comments';
      component.score = 4;
      component.price = 100;
      component.setSold();
      expect(reviewService.createAsSeller).toHaveBeenCalledWith({
        to_user_id: '1',
        item_id: ITEM_ID,
        comments: 'comments',
        score: 4 * 20,
        price: 100
      });
      expect(component.thanks).toBeTruthy();
    });
  });

});
