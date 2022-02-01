import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PayviewComponent } from '@private/features/payview/components/payview/payview.component';
import { PayviewOverviewComponent } from '@private/features/payview/components/overview/payview-overview.component';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

describe('PayviewComponent', () => {
  let component: PayviewComponent;
  let fixture: ComponentFixture<PayviewComponent>;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PayviewComponent],
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
      spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve() });

      fixture.detectChanges();
    });

    it('should open the payview overview component', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(PayviewOverviewComponent);
    });
  });
});
