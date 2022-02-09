import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivatedRoute } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { PayviewComponent } from '@private/features/payview/components/payview/payview.component';
import { PayviewModalComponent } from '@private/features/payview/modals/payview-modal/payview-modal.component';

describe('PayviewComponent', () => {
  const fakeItemHash: string = 'this_is_a_fake_hash';
  const modalRef: Partial<NgbModalRef> = {
    result: Promise.resolve(),
    componentInstance: {},
  };

  let component: PayviewComponent;
  let fixture: ComponentFixture<PayviewComponent>;
  let itemHash: string;
  let modalService: NgbModal;

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
            open() {
              return modalRef;
            },
          },
        },
      ],

      imports: [HttpClientTestingModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PayviewComponent);
    modalService = TestBed.inject(NgbModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the Payview initializes...', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.callThrough();

      fixture.detectChanges();
    });

    it('should open the payview modal component', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(PayviewModalComponent);
    });

    it('should pass the item hash to the modal component', () => {
      expect(modalRef.componentInstance.itemHash).toEqual(fakeItemHash);
    });
  });
});
