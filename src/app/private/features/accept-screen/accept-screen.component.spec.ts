import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceptScreenComponent } from './accept-screen.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AcceptScreenModalComponent } from './components/accept-screen-modal/accept-screen-modal.component';

describe('AcceptScreenComponent', () => {
  let component: AcceptScreenComponent;
  let fixture: ComponentFixture<AcceptScreenComponent>;
  let modalService: NgbModal;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcceptScreenComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceptScreenComponent);
    modalService = TestBed.inject(NgbModal);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when the Accept Screen inits...', () => {
    beforeEach(() => {
      spyOn(modalService, 'open').and.returnValue({ result: Promise.resolve() });

      fixture.detectChanges();
    });

    it('should open the accept screen modal', () => {
      expect(modalService.open).toHaveBeenCalledTimes(1);
      expect(modalService.open).toHaveBeenCalledWith(AcceptScreenModalComponent);
    });
  });
});
