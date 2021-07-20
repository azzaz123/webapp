import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KYCComponent } from './kyc.component';
import { KycModalComponent } from './modals/kyc-modal/kyc-modal.component';

describe('KYCComponent', () => {
  let component: KYCComponent;
  let fixture: ComponentFixture<KYCComponent>;
  let modalService: NgbModal;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [KYCComponent],
      providers: [
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
    fixture = TestBed.createComponent(KYCComponent);
    component = fixture.componentInstance;
    modalService = TestBed.inject(NgbModal);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the component inits...', () => {
    describe('and the user close the modal...', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve() });
        spyOn(router, 'navigate');

        component.ngOnInit();
      });

      it('should open the kyc modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(KycModalComponent, {
          windowClass: 'kyc',
        });
      });

      it('should redirect to the ballance page', () => {
        expect(router.navigate).toHaveBeenCalledWith([component.WALLET_BALANCE_LINK]);
      });
    });

    describe('and the user dismiss the modal...', () => {
      beforeEach(() => {
        spyOn(modalService, 'open').and.returnValue({ result: Promise.reject() });
        spyOn(router, 'navigate');

        component.ngOnInit();
      });

      it('should open the kyc modal', () => {
        expect(modalService.open).toHaveBeenCalledWith(KycModalComponent, {
          windowClass: 'kyc',
        });
      });

      it('should redirect to the ballance page', () => {
        expect(router.navigate).toHaveBeenCalledWith([component.WALLET_BALANCE_LINK]);
      });
    });
  });
});
