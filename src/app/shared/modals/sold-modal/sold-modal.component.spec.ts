import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { SoldModalComponent } from './sold-modal.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ItemService } from '../../../core/item/item.service';
import { of } from 'rxjs';
import { CONVERSATION_USERS, ITEM_ID, ITEM_SALE_PRICE, MOCK_ITEM } from '../../../../tests/item.fixtures.spec';


describe('SoldModalComponent', () => {
  let component: SoldModalComponent;
  let fixture: ComponentFixture<SoldModalComponent>;
  let itemService: ItemService;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      providers: [
        NgbActiveModal,
        {
          provide: ItemService, useValue: {
          getConversationUsers() {
            return of(CONVERSATION_USERS);
          },
          soldOutside() {
            return of({});
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
    itemService = TestBed.inject(ItemService);
    activeModal = TestBed.inject(NgbActiveModal);
    spyOn(itemService, 'getConversationUsers').and.callThrough();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
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

      expect(component.userToReview).toEqual(CONVERSATION_USERS[0]);
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

  describe('onFinishedReview', () => {
    it('should set thanks to true when invoked', () => {
      component.onFinishedReview();

      expect(component.thanks).toBe(true);
    });
  });

  describe('onBackPress', () => {
    it('should reset buyer when invoked', () => {
      component.chooseUser(CONVERSATION_USERS[0]);
      component.onBackPress();

      expect(component.userToReview).toBe(undefined);
    });
  });

});
