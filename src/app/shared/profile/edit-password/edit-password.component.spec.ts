import {
  ComponentFixture,
  fakeAsync,
  TestBed,
  waitForAsync,
} from '@angular/core/testing';

import { EditPasswordComponent } from './edit-password.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { PasswordModalComponent } from './password-modal/password-modal.component';

describe('EditPasswordComponent', () => {
  let component: EditPasswordComponent;
  let fixture: ComponentFixture<EditPasswordComponent>;
  let modalService: NgbModal;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        imports: [FormsModule],
        providers: [
          {
            provide: NgbModal,
            useValue: {
              open() {},
            },
          },
        ],
        declarations: [EditPasswordComponent],
      }).compileComponents();
    })
  );

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    modalService = TestBed.inject(NgbModal);
  });

  describe('openModal', () => {
    let element: any;

    beforeEach(fakeAsync(() => {
      element = {
        blur() {},
      };
      spyOn(element, 'blur');
      spyOn(modalService, 'open').and.callThrough();

      component.openModal(element);
    }));

    it('should call blur on element', () => {
      expect(element.blur).toHaveBeenCalled();
    });

    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(PasswordModalComponent, {
        windowClass: 'account-details',
      });
    });
  });
});
