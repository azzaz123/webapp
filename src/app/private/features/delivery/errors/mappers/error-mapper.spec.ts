import { HttpErrorResponse, HttpEventType, HttpHeaders } from '@angular/common/http';
import { fakeAsync, tick } from '@angular/core/testing';
import { ErrorMapper } from './error-mapper';

class TestWrapperErrorMapper extends ErrorMapper<HttpErrorResponse> {}
const errorMapper = new TestWrapperErrorMapper();

const commonErrorResponseAttributes: HttpErrorResponse = {
  message: 'Http failure response',
  name: 'HttpErrorResponse',
  ok: false,
  status: 409,
  statusText: 'Conflict',
  url: 'url',
  error: null,
  type: HttpEventType.Response,
  headers: new HttpHeaders(),
};

const errorMessage = 'Errorsito';

let mockErrorResponse: HttpErrorResponse;

describe('when mapping an error from backend', () => {
  describe('and error is a collection of errors with message', () => {
    beforeEach(() => (mockErrorResponse = { ...commonErrorResponseAttributes, error: [{ message: errorMessage }] }));

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
    beforeEach(() => (mockErrorResponse = { ...commonErrorResponseAttributes, error: { message: errorMessage } }));

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
    beforeEach(() => (mockErrorResponse = { ...commonErrorResponseAttributes, error: null }));

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
