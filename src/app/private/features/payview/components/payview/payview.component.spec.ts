import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PayviewComponent } from '@private/features/payview/components/payview/payview.component';
import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';
import { DELIVERY_MODAL_CLASSNAME } from '@private/features/delivery/constants/delivery-constants';

@Component({
  selector: 'tsl-blank',
  template: '',
})
class FakeComponent {}

describe('PayviewComponent', () => {
  const chatPath: string = PRIVATE_PATHS.CHAT;
  const fakeItemHash: string = 'this_is_a_fake_hash';
  const MOCK_RESULT_PROMISE: Promise<void> = Promise.resolve();
  const MOCK_CLOSE_CALLBACK = () => {};
  const MOCK_MODAL_REF: Partial<NgbModalRef> = {
    close: MOCK_CLOSE_CALLBACK,
    dismiss: MOCK_CLOSE_CALLBACK,
    componentInstance: {},
    result: MOCK_RESULT_PROMISE,
  };

  let component: PayviewComponent;
  let fixture: ComponentFixture<PayviewComponent>;
  let modalRef: NgbModalRef;
  let modalService: NgbModal;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              paramMap: {
                get: () => fakeItemHash,
              },
            },
          },
        },
        {
          provide: NgbModal,
          useValue: {
            open: () => MOCK_MODAL_REF,
          },
        },
      ],

      imports: [HttpClientTestingModule, RouterTestingModule],
    }).compileComponents();
  });

  describe('when the Payview initializes...', () => {
    beforeEach(() => {
      fixture = TestBed.createComponent(PayviewComponent);
      component = fixture.componentInstance;

      modalService = TestBed.inject(NgbModal);
      modalRef = modalService.open(FakeComponent);
      router = TestBed.inject(Router);

      spyOn(modalService, 'open').and.returnValue(modalRef);
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should open the payview modal component', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(PayviewModalComponent, { backdrop: 'static', windowClass: DELIVERY_MODAL_CLASSNAME });
    });

    it('should assign the corresponding payload to the payview modal component', () => {
      expect(modalRef.componentInstance.itemHash).toEqual(fakeItemHash);
    });

    it('should assign the corresponding close logic to the payview modal component', () => {
      const stringifiedCallbackInComponent: string = JSON.stringify(modalRef.componentInstance.closeCallback);
      const stringifiedCallbackExpected: string = JSON.stringify(MOCK_CLOSE_CALLBACK.bind(MOCK_MODAL_REF));

      expect(stringifiedCallbackInComponent).toEqual(stringifiedCallbackExpected);
    });

    describe('when the modal closes', () => {
      beforeEach(fakeAsync(() => {
        spyOn(router, 'navigate');

        modalRef.close();
        tick();
      }));

      it('should navigate to chat', () => {
        expect(router.navigate).toHaveBeenCalledWith([chatPath]);
      });
    });

    describe('when the modal dismisses', () => {
      beforeEach(fakeAsync(() => {
        spyOn(router, 'navigate');

        modalRef.dismiss();
        tick();
      }));

      it('should navigate to chat', () => {
        expect(router.navigate).toHaveBeenCalledWith([chatPath]);
      });
    });
  });
});
