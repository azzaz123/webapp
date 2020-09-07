import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';

import { EditEmailComponent } from './edit-email.component';
import { FormsModule } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from './email-modal/email-modal.component';
import { USER_EMAIL } from '../../../../tests/user.fixtures.spec';

describe('EditEmailComponent', () => {
  let component: EditEmailComponent;
  let fixture: ComponentFixture<EditEmailComponent>;
  let modalService: NgbModal;
  const componentInstance: any = {};

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      providers: [
        {
          provide: NgbModal, useValue: {
          open() {
            return {
              componentInstance: componentInstance
            };
          }
        }
        }
      ],
      declarations: [EditEmailComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditEmailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalService = TestBed.inject(NgbModal);
  });

  describe('openModal', () => {

    let element: any;

    beforeEach(fakeAsync(() => {
      element = {
        blur() {
        }
      };
      spyOn(element, 'blur');
      spyOn(modalService, 'open').and.callThrough();
      component.email = USER_EMAIL;

      component.openModal(element);
    }));

    it('should call blur on element', () => {
      expect(element.blur).toHaveBeenCalled();
    });

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(EmailModalComponent, {windowClass: 'account-details'});
    });

    it('should set currentEmail', () => {
      expect(componentInstance.currentEmail).toBe(USER_EMAIL);
    });

  });
});
