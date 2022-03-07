import { ActivatedRoute, Router } from '@angular/router';
import { Component } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { PayviewComponent } from '@private/features/payview/components/payview/payview.component';
import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';

import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PRIVATE_PATHS } from '@private/private-routing-constants';

@Component({
  selector: 'tsl-blank',
  template: '',
})
class FakeComponent {}

describe('PayviewComponent', () => {
  const chatPath: string = PRIVATE_PATHS.CHAT;
  const fakeItemHash: string = 'this_is_a_fake_hash';

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
        NgbModal,
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
      expect(modalService.open).toHaveBeenCalledWith(PayviewModalComponent, { windowClass: 'payview' });
    });

    it('should assign the corresponding payload to the payview modal component', () => {
      expect(modalRef.componentInstance.itemHash).toEqual(fakeItemHash);
    });

    describe('WHEN Modal closes', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
      });

      it('should navigate to chat', fakeAsync(() => {
        modalRef.close();
        tick();

        expect(router.navigate).toHaveBeenCalledWith([chatPath]);
      }));
    });

    describe('WHEN Modal dismisses', () => {
      beforeEach(() => {
        spyOn(router, 'navigate');
      });

      it('should navigate to chat', fakeAsync(() => {
        modalRef.dismiss();
        tick();

        expect(router.navigate).toHaveBeenCalledWith([chatPath]);
      }));
    });
  });
});
