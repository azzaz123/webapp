import { TestBed } from '@angular/core/testing';

import { ExitConfirmGuard } from './exit-confirm.guard';

describe('ExitConfirmGuard', () => {
  let guard: ExitConfirmGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ExitConfirmGuard],
    });
    guard = TestBed.inject(ExitConfirmGuard);
  });

  it('should call canExit', () => {
    const canExit = jasmine.createSpy('canExit');
    const component = {
      canExit: canExit,
    };

    guard.canDeactivate(component);

    expect(canExit).toHaveBeenCalled();
  });
});
