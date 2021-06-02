import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { MOCK_ERROR_RESPONSE } from '@fixtures/private/delivery/errors/delivery-errors.fixtures.spec';
import { ErrorMapper } from './error-mapper';

class TestWrapperErrorMapper extends ErrorMapper<HttpErrorResponse> {}
const errorMapper = new TestWrapperErrorMapper();

const errorMessage = 'Errorsito';

let mockErrorResponse: HttpErrorResponse;

describe('when mapping an error from backend', () => {
  describe('and error is a collection of errors with message', () => {
    beforeEach(() => (mockErrorResponse = { ...MOCK_ERROR_RESPONSE, error: [{ message: errorMessage }] }));

    it('should notify message from server', fakeAsync(() => {
      let result: Error[];

      errorMapper.map(mockErrorResponse).subscribe(
        () => {},
        (errors) => (result = errors)
      );
      tick();

      expect(result[0] instanceof Error).toBe(true);
      expect(result[0].message).toEqual(errorMessage);
    }));
  });

  describe('and error has message', () => {
    beforeEach(() => (mockErrorResponse = { ...MOCK_ERROR_RESPONSE, error: { message: errorMessage } }));

    it('should notify message from server', fakeAsync(() => {
      let result: Error;

      errorMapper.map(mockErrorResponse).subscribe(
        () => {},
        (errors) => (result = errors)
      );
      tick();

      expect(result instanceof Error).toBe(true);
      expect(result.message).toEqual(errorMessage);
    }));
  });

  describe('and error does not have message', () => {
    beforeEach(() => (mockErrorResponse = { ...MOCK_ERROR_RESPONSE, error: null }));

    it('should notify default error message', fakeAsync(() => {
      let result: Error;

      errorMapper.map(mockErrorResponse).subscribe(
        () => {},
        (errors) => (result = errors)
      );
      tick();

      expect(result instanceof Error).toBe(true);
      expect(result.message).toEqual(ErrorMapper.DEFAULT_ERROR_MESSAGE);
    }));
  });
});
