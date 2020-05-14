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
      let Mock_Toast: Toast = { text: 'mocked toast created', type: 'success' };

      service.show(Mock_Toast);

      expect(service.toasts).toContain(Mock_Toast)
    })

    describe('remove', () => {
      it('remove toast from toast array', () => {
        let Mock_Toast: Toast = { text: 'mocked toast removed', type: 'success' }

        service.remove(Mock_Toast);

        expect(service.toasts).not.toContain(Mock_Toast)
      })
    })
  })
  
});
