import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { MockedUserService, MOCK_FULL_USER } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { EmailVerificationComponent } from './email-verification.component';
import { EmailVerificationModalComponent } from './modals/email-verification-modal/email-verification-modal.component';

describe('EmailVerificationComponent', () => {
  let component: EmailVerificationComponent;
  let fixture: ComponentFixture<EmailVerificationComponent>;
  let modalService: NgbModal;
  let userService: UserService;
  let router: Router;
  let spyModalSerivce;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EmailVerificationComponent],
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
    fixture = TestBed.createComponent(EmailVerificationComponent);
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

    it('should open the email verification modal ', () => {
      expect(modalService.open).toHaveBeenCalledWith(EmailVerificationModalComponent, {
        windowClass: 'modal-standard',
      });
    });

    describe('when the user closes the modal...', () => {
      it('should redirect to verifications view', () => {
        expect(router.navigate).toHaveBeenCalledWith([component.VERIFICATIONS_PATH]);
      });
    });

    describe('when the user dismiss the modal...', () => {
      it('should redirect to verifications view', () => {
        spyModalSerivce.and.returnValue({ result: Promise.reject(), componentInstance: { email: '' } });
        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith([component.VERIFICATIONS_PATH]);
      });
    });
  });
});
