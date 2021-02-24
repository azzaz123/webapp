import { TestBed } from '@angular/core/testing';
import { MOCK_CAR } from '@fixtures/car.fixtures.spec';
import { MOCK_REALESTATE } from '@fixtures/realestate.fixtures.spec';
import { TypeCheckService } from './type-check.service';

describe('TypeCheckService', () => {
  let typeCheckService: TypeCheckService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    typeCheckService = TestBed.inject(TypeCheckService);
  });

  it('should be created', () => {
    expect(typeCheckService).toBeTruthy();
  });

  describe('when we check if a constant is a number...', () => {
    it('should return true when is a number', () => {
      expect(typeCheckService.isNumber(8)).toBe(true);
    });
    it('should return false when is NOT a number', () => {
      expect(typeCheckService.isNumber(true)).toBe(false);
    });
  });

  describe('when we check if a constant is boolean...', () => {
    it('should return true when is a boolean', () => {
      expect(typeCheckService.isBoolean(true)).toBe(true);
      expect(typeCheckService.isBoolean(false)).toBe(true);
    });
    it('should return false when is NOT a boolean', () => {
      expect(typeCheckService.isBoolean(8)).toBe(false);
    });
  });

  describe('when we check if a constant is a car...', () => {
    it('should return true when is a car', () => {
      expect(typeCheckService.isCar(MOCK_CAR)).toBe(true);
    });
    it('should return false when is NOT a car', () => {
      expect(typeCheckService.isCar(MOCK_REALESTATE)).toBe(false);
    });
  });

  describe('when we check if a constant is a real estate...', () => {
    it('should return true when is a real estate', () => {
      expect(typeCheckService.isRealEstate(MOCK_REALESTATE)).toBe(true);
    });
    it('should return false when is NOT a real estate', () => {
      expect(typeCheckService.isRealEstate(MOCK_CAR)).toBe(false);
    });
  });
});