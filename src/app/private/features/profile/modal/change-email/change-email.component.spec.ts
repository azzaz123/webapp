import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { MockedUserService, MOCK_FULL_USER } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailModalComponent } from '@shared/profile/edit-email/email-modal/email-modal.component';
import { ChangeEmailComponent } from './change-email.component';

describe('ChangeEmailComponent', () => {
  let component: ChangeEmailComponent;
  let fixture: ComponentFixture<ChangeEmailComponent>;
  let modalService: NgbModal;
  let userService: UserService;
  let router: Router;
  let spyModalSerivce;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChangeEmailComponent],
      providers: [
        { provide: UserService, useClass: MockedUserService },
        {
          provide: Router,
          useValue: {
            navigate() {},
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeEmailComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
    userService = TestBed.inject(UserService);
    spyModalSerivce = spyOn(modalService, 'open');
  });

  describe('when the component is loaded', () => {
    beforeEach(() => {
      jest.spyOn(userService, 'user', 'get').mockReturnValue(MOCK_FULL_USER);
      spyModalSerivce.and.returnValue({ result: Promise.resolve(), componentInstance: { email: '' } });
      spyOn(router, 'navigate');

      component.ngOnInit();
    });

    it('should open the change email modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(EmailModalComponent, {
        windowClass: 'modal-standard',
      });
    });

    it('should redirect to verifications view when user closes the modal', () => {
      expect(router.navigate).toHaveBeenCalledWith([component.VERIFICATIONS_PATH]);
    });

    it('should redirect to verifications view when user dismiss the modal', () => {
      spyModalSerivce.and.returnValue({ result: Promise.reject(), componentInstance: { email: '' } });
      fixture.detectChanges();

      expect(router.navigate).toHaveBeenCalledWith([component.VERIFICATIONS_PATH]);
    });
  });
});
