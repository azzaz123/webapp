import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { UserService } from '@core/user/user.service';
import { MockedUserService } from '@fixtures/user.fixtures.spec';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { PhoneVerificationComponent } from './phone-verification.component';
import { PhoneVerificationModalComponent } from './modals/phone-verification-modal/phone-verification-modal.component';

describe('PhoneVerificationComponent', () => {
  let component: PhoneVerificationComponent;
  let fixture: ComponentFixture<PhoneVerificationComponent>;
  let modalService: NgbModal;
  let router: Router;
  let spyModalSerivce;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PhoneVerificationComponent],
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
    fixture = TestBed.createComponent(PhoneVerificationComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
    spyModalSerivce = spyOn(modalService, 'open');
  });

  describe('when the component is loaded', () => {
    beforeEach(() => {
      spyModalSerivce.and.returnValue({ result: Promise.resolve(), componentInstance: {} });
      spyOn(router, 'navigate');

      component.ngOnInit();
    });

    it('should open the phone verification modal ', () => {
      expect(modalService.open).toHaveBeenCalledWith(PhoneVerificationModalComponent, {
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
        spyModalSerivce.and.returnValue({ result: Promise.reject(), componentInstance: {} });
        fixture.detectChanges();

        expect(router.navigate).toHaveBeenCalledWith([component.VERIFICATIONS_PATH]);
      });
    });
  });
});
