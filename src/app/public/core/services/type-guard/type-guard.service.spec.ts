import { TestBed } from '@angular/core/testing';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { MOCK_REALESTATE } from '@fixtures/realestate.fixtures.spec';
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

  describe('when we check if a constant is a number...', () => {
    it('should return true when is a number', () => {
      expect(typeGuardService.isNumber(8)).toBe(true);
    });
    it('should return false when is NOT a number', () => {
      expect(typeGuardService.isNumber(true)).toBe(false);
    });
  });

  describe('when we check if a constant is boolean...', () => {
    it('should return true when is a boolean', () => {
      expect(typeGuardService.isBoolean(true)).toBe(true);
      expect(typeGuardService.isBoolean(false)).toBe(true);
    });
    it('should return false when is NOT a boolean', () => {
      expect(typeGuardService.isBoolean(8)).toBe(false);
    });
  });

  describe('when we check if a constant is a car...', () => {
    it('should return true when is a car', () => {
      expect(typeGuardService.isCar(MOCK_CAR)).toBe(true);
    });
    it('should return false when is NOT a car', () => {
      expect(typeGuardService.isCar(MOCK_REALESTATE)).toBe(false);
    });
  });

  describe('when we check if a constant is a real estate...', () => {
    it('should return true when is a real estate', () => {
      expect(typeGuardService.isRealEstate(MOCK_REALESTATE)).toBe(true);
    });
    it('should return false when is NOT a real estate', () => {
      expect(typeGuardService.isRealEstate(MOCK_CAR)).toBe(false);
    });
  });
});
