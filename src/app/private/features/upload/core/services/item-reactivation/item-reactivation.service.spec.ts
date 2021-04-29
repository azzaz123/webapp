import { TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ToastService } from '@layout/toast/core/services/toast.service';
import { ItemReactivationService } from './item-reactivation.service';

describe('ItemReactictivationService', () => {
  let service: ItemReactivationService;
  let toastService: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ItemReactivationService, ToastService],
    });
    service = TestBed.inject(ItemReactivationService);
    toastService = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when asking for reactivation validation', () => {
    describe('and form is invalid', () => {
      const form = new FormGroup({
        field: new FormControl('', [Validators.required]),
      });

      beforeEach(() => {
        spyOn(toastService, 'show');
        spyOn(form, 'markAsPending');

        service.reactivationValidation(form);
      });

      it('should ask toast service to show message', () => {
        expect(toastService.show).toHaveBeenCalledWith(service['toastValidationError']);
      });
      it('should mark form as pending to trigger validations', () => {
        setTimeout(() => {
          expect(form.markAsPending).toHaveBeenCalled();
        });
      });
    });

    describe('and form is valid', () => {
      const form = new FormGroup({});

      beforeEach(() => {
        spyOn(toastService, 'show');
        spyOn(form, 'markAsPending');

        service.reactivationValidation(form);
      });
      it('should NOT ask toast service to show message', () => {
        expect(toastService.show).not.toHaveBeenCalled();
      });
      it('should NOT mark form as pending to trigger validations', () => {
        expect(form.markAsPending).not.toHaveBeenCalled();
      });
    });
  });
});
