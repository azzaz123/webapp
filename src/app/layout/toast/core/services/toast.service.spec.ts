import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { Toast, TOAST_TYPES } from '../interfaces/toast.interface';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastService],
    });
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('show add toast into toast array', () => {
      let MOCK_TOAST: Toast = { text: 'mocked toast created', type: TOAST_TYPES.SUCCESS };

      service.show(MOCK_TOAST);

      expect(service.toasts).toContain(MOCK_TOAST);
    });

    describe('remove', () => {
      it('remove toast from toast array', () => {
        let MOCK_TOAST: Toast = {
          text: 'mocked toast removed',
          type: TOAST_TYPES.SUCCESS,
        };

        service.remove(MOCK_TOAST);

        expect(service.toasts).not.toContain(MOCK_TOAST);
      });
    });
  });
});
