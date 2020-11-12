import { TestBed } from '@angular/core/testing';
import { AbstractControl } from '@angular/forms';

import { FormValidatorsService } from './form-validators.service';

describe('FormValidatorsService', () => {
  let service: FormValidatorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FormValidatorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when using validator...', () => {
    it('should be valid if we dont have value', () => {
      const nullControl = { value: null };

      expect(service.whitespaceValidator(nullControl as AbstractControl)).toBe(
        null
      );
    });

    it('should be valid if we have a value', () => {
      const normalControl = { value: 'function will return null' };

      expect(
        service.whitespaceValidator(normalControl as AbstractControl)
      ).toBe(null);
    });

    it('should be invalid if we have an empty value', () => {
      const emptyControl = { value: '   ' };
      const expectedResponse = { whitespace: true };

      expect(
        service.whitespaceValidator(emptyControl as AbstractControl)
      ).toStrictEqual(expectedResponse);
    });
  });
});
