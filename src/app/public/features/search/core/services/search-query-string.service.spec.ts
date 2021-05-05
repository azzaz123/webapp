import { fakeAsync, inject, TestBed, tick } from '@angular/core/testing';

import { SearchQueryStringService } from './search-query-string.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import 'rxjs/add/operator/debounceTime';
import MockedFunction = jest.MockedFunction;
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';

describe('QueryStringServiceService', () => {
  let navigate: MockedFunction<() => void>;
  let paramsSubject: BehaviorSubject<Params>;

  beforeEach(() => {
    navigate = jest.fn();
    paramsSubject = new BehaviorSubject<Params>({});
    TestBed.configureTestingModule({
      providers: [
        SearchQueryStringService,
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: paramsSubject.asObservable(),
          },
        },
        {
          provide: Router,
          useValue: {
            navigate,
          },
        },
      ],
    });
  });

  it('should be created', fakeAsync(
    inject([SearchQueryStringService], (service: SearchQueryStringService) => {
      tick(100);
      expect(service).toBeTruthy();
    })
  ));

  describe('when initialize with no params', () => {
    beforeEach(() => {
      paramsSubject.next({});
    });
    it('should emit queryStringParams$ empty array', fakeAsync(
      inject([SearchQueryStringService], (service: SearchQueryStringService) => {
        const callback = jest.fn();
        service.queryStringParams$.subscribe(callback);

        tick(100);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([]);
      })
    ));
  });

  describe('when initialized with params', () => {
    beforeEach(() => {
      paramsSubject.next({ param: 'value' });
    });

    it('should emit queryStringParams$ with parameters', fakeAsync(
      inject([SearchQueryStringService], (service: SearchQueryStringService) => {
        const callback = jest.fn();
        service.queryStringParams$.subscribe(callback);

        tick(100);

        expect(callback).toHaveBeenCalledTimes(1);
        expect(callback).toHaveBeenCalledWith([{ key: 'param', value: 'value' }]);
      })
    ));
  });

  describe('when setting new params', () => {
    beforeEach(() => {
      paramsSubject.next({ param: 'value' });
    });

    describe('and params are the same as the current ones', () => {
      it('should not navigate to new route', fakeAsync(
        inject([SearchQueryStringService], (service: SearchQueryStringService) => {
          tick(100);
          service.setQueryParams([{ key: 'param' as FILTER_QUERY_PARAM_KEY, value: 'value' }]);
          tick(100);

          expect(navigate).toHaveBeenCalledTimes(0);
        })
      ));
    });

    describe('and params have changed', () => {
      beforeEach(() => {
        paramsSubject.next({ param: 'value' });
      });

      describe('when param value changes', () => {
        it('should navigate to new route', fakeAsync(
          inject([SearchQueryStringService], (service: SearchQueryStringService) => {
            tick(100);

            service.setQueryParams([{ key: 'param' as FILTER_QUERY_PARAM_KEY, value: 'value2' }]);
            tick(100);

            expect(navigate).toHaveBeenCalledTimes(1);
            expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: { param: 'value2' } });
          })
        ));
      });

      describe('when adding new param', () => {
        it('should navigate to new route', fakeAsync(
          inject([SearchQueryStringService], (service: SearchQueryStringService) => {
            tick(100);

            service.setQueryParams([
              { key: 'param' as FILTER_QUERY_PARAM_KEY, value: 'value' },
              { key: 'param2' as FILTER_QUERY_PARAM_KEY, value: 'value2' },
            ]);
            tick(100);

            expect(navigate).toHaveBeenCalledTimes(1);
            expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: { param: 'value', param2: 'value2' } });
          })
        ));
      });

      describe('when clearing params', () => {
        it('should navigate to new route', fakeAsync(
          inject([SearchQueryStringService], (service: SearchQueryStringService) => {
            tick(100);

            service.setQueryParams([]);
            tick(100);

            expect(navigate).toHaveBeenCalledTimes(1);
            expect(navigate).toHaveBeenCalledWith(['/search'], { queryParams: {} });
          })
        ));
      });
    });
  });
});
