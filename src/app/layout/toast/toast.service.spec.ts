import { TestBed } from '@angular/core/testing';

import { ToastService } from './toast.service';
import { Toast } from './toast.interface';

describe('ToastService', () => {
  let service: ToastService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('show', () => {
    it('show add toast into toast array', () => {
      let MOCK_TOAST: Toast = { text: 'mocked toast created', type: 'success' };

      service.show(MOCK_TOAST);

      expect(service.toasts).toContain(MOCK_TOAST)
    })

    describe('remove', () => {
      it('remove toast from toast array', () => {
        let MOCK_TOAST: Toast = { text: 'mocked toast removed', type: 'success' }

        service.remove(MOCK_TOAST);

        expect(service.toasts).not.toContain(MOCK_TOAST)
      })
    })
  })
  
});
