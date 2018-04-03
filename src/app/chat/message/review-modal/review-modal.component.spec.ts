import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewModalComponent } from './review-modal.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../core/user/user.service';
import { MOCK_USER, USER_ID } from '../../../../tests/user.fixtures.spec';
import { MOCK_ITEM } from '../../../../tests/item.fixtures.spec';

describe('ReviewModalComponent', () => {
  let component: ReviewModalComponent;
  let fixture: ComponentFixture<ReviewModalComponent>;
  let userService: UserService;
  let activeModal: NgbActiveModal;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ReviewModalComponent],
      providers: [
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
    fixture.detectChanges();
    userService = TestBed.get(UserService);
    activeModal = TestBed.get(NgbActiveModal);
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should get and set user', () => {
      spyOn(userService, 'get').and.callThrough();
      component.ngOnInit();
      expect(userService.get).toHaveBeenCalledWith(USER_ID);
      expect(component.user).toEqual(MOCK_USER);
    });
  });

  describe('close', () => {
    it('should call close', () => {
      spyOn(activeModal, 'close');
      component.score = 4;
      component.comments = 'comment';
      component.user = MOCK_USER;
      component.close();
      expect(activeModal.close).toHaveBeenCalledWith({
        score: 4,
        comments: 'comment',
        userId: USER_ID
      });
    });
  });

  describe('onRated', () => {
    it('should set score', () => {
      component.onRated(4);
      expect(component.score).toBe(4);
    });
  });
});
