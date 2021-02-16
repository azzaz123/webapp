import { TestBed } from '@angular/core/testing';
import { TypeGuardService } from './type-guard.service';

describe('TypeGuardService', () => {
  let typeGuardService: TypeGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    typeGuardService = TestBed.inject(TypeGuardService);
  });

  it('should be created', () => {
    expect(typeGuardService).toBeTruthy();
  });
});
