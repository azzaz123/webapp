import { TestBed } from '@angular/core/testing';

import { HostVisibilityService, QueryParamVisibilityCondition } from './host-visibility.service';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import { FilterHostComponent } from '../filter-host.component';

interface MockedHostConfig {
  filterConfig: { mapKey: Record<string, FILTER_QUERY_PARAM_KEY> };
  variant: FILTER_VARIANT;
}

class MockedHost {
  public hostConfig: MockedHostConfig;

  constructor(private config: MockedHostConfig) {
    this.hostConfig = config;
  }
}

describe('HostVisibilityService', () => {
  let service: HostVisibilityService;
  let drawerStore: FilterParameterStoreService;
  let bubbleStore: FilterParameterStoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        HostVisibilityService,
        {
          provide: FILTER_PARAMETER_DRAFT_STORE_TOKEN,
          useClass: FilterParameterStoreService,
        },
        {
          provide: FILTER_PARAMETER_STORE_TOKEN,
          useClass: FilterParameterStoreService,
        },
      ],
    });
    service = TestBed.inject(HostVisibilityService);
    service.init();
    drawerStore = TestBed.inject<FilterParameterStoreService>(FILTER_PARAMETER_DRAFT_STORE_TOKEN);
    bubbleStore = TestBed.inject<FilterParameterStoreService>(FILTER_PARAMETER_STORE_TOKEN);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('when host attaches', () => {
    let visibleHost: FilterHostComponent;
    let invisibleHost: FilterHostComponent;

    beforeEach(() => {
      visibleHost = createMockedHost(FILTER_QUERY_PARAM_KEY.condition);
      invisibleHost = createMockedHost(FILTER_QUERY_PARAM_KEY.size);
    });

    it('should notify about the visibility', () => {
      const visibleObservable = service.attach(visibleHost);
      const invisibleObservable = service.attach(invisibleHost);

      let expectedPositiveVisibility: boolean;
      let expectedNegativeVisibility: boolean;

      visibleObservable.subscribe((visibility) => (expectedPositiveVisibility = visibility));
      invisibleObservable.subscribe((visibility) => (expectedNegativeVisibility = visibility));

      expect(expectedPositiveVisibility).toBe(true);
      expect(expectedNegativeVisibility).toBe(false);
    });
  });

  describe('when values change', () => {
    let conditionDrawerHost: FilterHostComponent;
    let sizeDrawerHost: FilterHostComponent;
    let conditionDrawerVisibility: boolean;
    let sizeDrawerVisibility: boolean;

    let conditionBubbleHost: FilterHostComponent;
    let sizeBubbleHost: FilterHostComponent;
    let conditionBubbleVisibility: boolean;
    let sizeBubbleVisibility: boolean;

    beforeEach(() => {
      conditionDrawerHost = createMockedHost(FILTER_QUERY_PARAM_KEY.condition, FILTER_VARIANT.CONTENT);
      sizeDrawerHost = createMockedHost(FILTER_QUERY_PARAM_KEY.size, FILTER_VARIANT.CONTENT);
      conditionBubbleHost = createMockedHost(FILTER_QUERY_PARAM_KEY.condition, FILTER_VARIANT.BUBBLE);
      sizeBubbleHost = createMockedHost(FILTER_QUERY_PARAM_KEY.size, FILTER_VARIANT.BUBBLE);

      service.attach(conditionDrawerHost).subscribe((visibility) => (conditionDrawerVisibility = visibility));
      service.attach(sizeDrawerHost).subscribe((visibility) => (sizeDrawerVisibility = visibility));
      service.attach(conditionBubbleHost).subscribe((visibility) => (conditionBubbleVisibility = visibility));
      service.attach(sizeBubbleHost).subscribe((visibility) => (sizeBubbleVisibility = visibility));

      expect(conditionDrawerVisibility).toBe(true);
      expect(sizeDrawerVisibility).toBe(false);
      expect(conditionBubbleVisibility).toBe(true);
      expect(sizeBubbleVisibility).toBe(false);
    });

    describe('... in the drawer store', () => {
      it('should ONLY notify listeners whose visibility change', () => {
        drawerStore.setParameters([
          { key: FILTER_QUERY_PARAM_KEY.gender, value: 'any' },
          { key: FILTER_QUERY_PARAM_KEY.objectType, value: 'any' },
        ]);

        expect(conditionDrawerVisibility).toBe(true);
        expect(sizeDrawerVisibility).toBe(true);
        expect(conditionBubbleVisibility).toBe(true);
        expect(sizeBubbleVisibility).toBe(false);
      });
    });

    describe('... in the bubble store', () => {
      it('should ONLY notify listeners whose visibility change', () => {
        bubbleStore.setParameters([
          { key: FILTER_QUERY_PARAM_KEY.gender, value: 'any' },
          { key: FILTER_QUERY_PARAM_KEY.objectType, value: 'any' },
        ]);

        expect(conditionDrawerVisibility).toBe(true);
        expect(sizeDrawerVisibility).toBe(false);
        expect(conditionBubbleVisibility).toBe(true);
        expect(sizeBubbleVisibility).toBe(true);
      });
    });
  });

  describe('when host detaches', () => {
    let host: FilterHostComponent;
    let hostVisibility: boolean;

    beforeEach(() => {
      host = createMockedHost(FILTER_QUERY_PARAM_KEY.size);
      service.attach(host).subscribe((visibility) => (hostVisibility = visibility));

      expect(hostVisibility).toBe(false);
    });
    it('should not notify listener', () => {
      service.detach(host);

      bubbleStore.setParameters([{ key: FILTER_QUERY_PARAM_KEY.gender, value: 'any' }]);

      expect(hostVisibility).toBe(false);
    });
  });

  describe('when adding new visibility conditions', () => {
    const initialConditions: QueryParamVisibilityCondition[] = [
      {
        queryParam: FILTER_QUERY_PARAM_KEY.size,
        requiredQueryParams: [FILTER_QUERY_PARAM_KEY.gender, FILTER_QUERY_PARAM_KEY.objectType],
        excludingParameters: [],
      },
    ];

    describe('and the condition is for a new parameter', () => {
      it('should add condition to the list', () => {
        const newCondition: QueryParamVisibilityCondition = {
          queryParam: FILTER_QUERY_PARAM_KEY.condition,
          requiredQueryParams: [FILTER_QUERY_PARAM_KEY.latitude],
          excludingParameters: [],
        };
        service.addVisibilityConditions([newCondition]);

        expect(service['visibilityConditionsSubject'].getValue()).toEqual([...initialConditions, newCondition]);
      });
    });

    describe('and the condition is for an existing parameter', () => {
      describe('with new required parameters', () => {
        it('should merge required parameters', () => {
          const newCondition: QueryParamVisibilityCondition = {
            queryParam: FILTER_QUERY_PARAM_KEY.size,
            requiredQueryParams: [FILTER_QUERY_PARAM_KEY.latitude],
            excludingParameters: [],
          };
          service.addVisibilityConditions([newCondition]);

          expect(service['visibilityConditionsSubject'].getValue()).toEqual([
            {
              queryParam: FILTER_QUERY_PARAM_KEY.size,
              requiredQueryParams: [FILTER_QUERY_PARAM_KEY.gender, FILTER_QUERY_PARAM_KEY.objectType, FILTER_QUERY_PARAM_KEY.latitude],
              excludingParameters: [],
            },
          ]);
        });
      });

      describe('with existing required parameters', () => {
        it('should leave existing parameters', () => {
          const newCondition: QueryParamVisibilityCondition = {
            queryParam: FILTER_QUERY_PARAM_KEY.size,
            requiredQueryParams: [FILTER_QUERY_PARAM_KEY.gender],
            excludingParameters: [],
          };
          service.addVisibilityConditions([newCondition]);

          expect(service['visibilityConditionsSubject'].getValue()).toEqual([
            {
              queryParam: FILTER_QUERY_PARAM_KEY.size,
              requiredQueryParams: [FILTER_QUERY_PARAM_KEY.gender, FILTER_QUERY_PARAM_KEY.objectType],
              excludingParameters: [],
            },
          ]);
        });
      });

      describe('with new excluding parameters', () => {
        it('should add excluding parameters to the list', () => {
          const newCondition: QueryParamVisibilityCondition = {
            queryParam: FILTER_QUERY_PARAM_KEY.size,
            requiredQueryParams: [],
            excludingParameters: [
              {
                queryParam: FILTER_QUERY_PARAM_KEY.objectType,
                values: ['123'],
              },
            ],
          };
          service.addVisibilityConditions([newCondition]);

          expect(service['visibilityConditionsSubject'].getValue()).toEqual([
            {
              queryParam: FILTER_QUERY_PARAM_KEY.size,
              requiredQueryParams: [FILTER_QUERY_PARAM_KEY.gender, FILTER_QUERY_PARAM_KEY.objectType],
              excludingParameters: [
                {
                  queryParam: FILTER_QUERY_PARAM_KEY.objectType,
                  values: ['123'],
                },
              ],
            },
          ]);
        });
      });

      describe('with existing excluding parameters', () => {
        beforeEach(() => {
          const newCondition: QueryParamVisibilityCondition = {
            queryParam: FILTER_QUERY_PARAM_KEY.size,
            requiredQueryParams: [],
            excludingParameters: [
              {
                queryParam: FILTER_QUERY_PARAM_KEY.objectType,
                values: ['123'],
              },
            ],
          };
          service.addVisibilityConditions([newCondition]);
        });

        describe('with new values', () => {
          it('should merge the values', () => {
            const newCondition: QueryParamVisibilityCondition = {
              queryParam: FILTER_QUERY_PARAM_KEY.size,
              requiredQueryParams: [],
              excludingParameters: [
                {
                  queryParam: FILTER_QUERY_PARAM_KEY.objectType,
                  values: ['456'],
                },
              ],
            };
            service.addVisibilityConditions([newCondition]);

            expect(service['visibilityConditionsSubject'].getValue()).toEqual([
              {
                queryParam: FILTER_QUERY_PARAM_KEY.size,
                requiredQueryParams: [FILTER_QUERY_PARAM_KEY.gender, FILTER_QUERY_PARAM_KEY.objectType],
                excludingParameters: [
                  {
                    queryParam: FILTER_QUERY_PARAM_KEY.objectType,
                    values: ['123', '456'],
                  },
                ],
              },
            ]);
          });
        });

        describe('with existing values', () => {
          it('should keep the original values', () => {
            const newCondition: QueryParamVisibilityCondition = {
              queryParam: FILTER_QUERY_PARAM_KEY.size,
              requiredQueryParams: [],
              excludingParameters: [
                {
                  queryParam: FILTER_QUERY_PARAM_KEY.objectType,
                  values: ['123'],
                },
              ],
            };
            service.addVisibilityConditions([newCondition]);

            expect(service['visibilityConditionsSubject'].getValue()).toEqual([
              {
                queryParam: FILTER_QUERY_PARAM_KEY.size,
                requiredQueryParams: [FILTER_QUERY_PARAM_KEY.gender, FILTER_QUERY_PARAM_KEY.objectType],
                excludingParameters: [
                  {
                    queryParam: FILTER_QUERY_PARAM_KEY.objectType,
                    values: ['123'],
                  },
                ],
              },
            ]);
          });
        });
      });
    });

    describe('and host visibility changes', () => {
      let conditionHost: FilterHostComponent;
      let conditionVisibility: boolean;

      beforeEach(() => {
        conditionHost = createMockedHost(FILTER_QUERY_PARAM_KEY.condition);

        service.attach(conditionHost).subscribe((visibility) => (conditionVisibility = visibility));

        expect(conditionVisibility).toBe(true);
      });

      it('should ONLY notify listeners whose visibility change', () => {
        service.addVisibilityConditions([
          {
            queryParam: FILTER_QUERY_PARAM_KEY.condition,
            requiredQueryParams: [FILTER_QUERY_PARAM_KEY.latitude],
            excludingParameters: [],
          },
        ]);

        expect(conditionVisibility).toBe(false);
      });
    });
  });

  function createMockedHost(queryParam: FILTER_QUERY_PARAM_KEY, variant: FILTER_VARIANT = FILTER_VARIANT.BUBBLE): FilterHostComponent {
    return (new MockedHost({
      filterConfig: { mapKey: { key: queryParam } },
      variant,
    }) as unknown) as FilterHostComponent;
  }
});
