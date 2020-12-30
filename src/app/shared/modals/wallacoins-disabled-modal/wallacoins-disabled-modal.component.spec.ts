import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WallacoinsDisabledModalComponent } from './wallacoins-disabled-modal.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { ButtonComponent } from 'app/shared/button/button.component';

let component: WallacoinsDisabledModalComponent;
let fixture: ComponentFixture<WallacoinsDisabledModalComponent>;
let activeModal: NgbActiveModal;

describe('WallacoinsDisabledModalComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WallacoinsDisabledModalComponent, ButtonComponent],
      providers: [
        {
          provide: NgbActiveModal,
          useValue: {
            close() {},
          },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WallacoinsDisabledModalComponent);
    component = fixture.componentInstance;
    activeModal = TestBed.inject(NgbActiveModal);
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('Close modal', () => {
    beforeEach(() => {
      spyOn(activeModal, 'close');
    });

    it('should be closed pressing close button', () => {
      const closeButton = fixture.debugElement.query(By.css('.modal-close'))
        .nativeElement;

      closeButton.click();

      expect(activeModal.close).toHaveBeenCalledTimes(1);
    });

    it('should be closed pressing main button', () => {
      const submitButton = fixture.debugElement.query(
        By.directive(ButtonComponent)
      ).nativeElement;

      submitButton.click();

      expect(activeModal.close).toHaveBeenCalledTimes(1);
    });
  });
});
