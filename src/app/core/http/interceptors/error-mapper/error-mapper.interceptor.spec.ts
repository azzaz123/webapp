import { TestBed } from '@angular/core/testing';

import { ErrorMapperInterceptor } from './error-mapper.interceptor';

describe('ErrorMapperInterceptor', () => {
  beforeEach(() =>
    TestBed.configureTestingModule({
      providers: [ErrorMapperInterceptor],
    })
  );

  it('should be created', () => {
    const interceptor: ErrorMapperInterceptor = TestBed.inject(ErrorMapperInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
