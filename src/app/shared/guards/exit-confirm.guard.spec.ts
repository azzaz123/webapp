import { TestBed, async, inject } from '@angular/core/testing';

import { ExitConfirmGuard } from './exit-confirm.guard';

describe('ExitConfirmGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExitConfirmGuard]
    });
  });

  it('should ...', inject([ExitConfirmGuard], (guard: ExitConfirmGuard) => {
    expect(guard).toBeTruthy();
  }));
});
