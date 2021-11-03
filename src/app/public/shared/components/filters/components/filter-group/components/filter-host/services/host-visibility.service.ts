import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { FilterHostComponent } from '../filter-host.component';
import { FILTER_QUERY_PARAM_KEY } from '@public/shared/components/filters/enums/filter-query-param-key.enum';
import { FILTER_VARIANT } from '@public/shared/components/filters/components/abstract-filter/abstract-filter.enum';
import {
  FILTER_PARAMETER_DRAFT_STORE_TOKEN,
  FILTER_PARAMETER_STORE_TOKEN,
  FilterParameterStoreService,
} from '@public/shared/services/filter-parameter-store/filter-parameter-store.service';

interface VisibilityListener {
  subject: BehaviorSubject<boolean>;
  host: FilterHostComponent;
  queryParams: FILTER_QUERY_PARAM_KEY[];
}

interface ExcludingParameter {
  queryParam: FILTER_QUERY_PARAM_KEY;
  values: string[];
}

export interface QueryParamVisibilityCondition {
  queryParam: FILTER_QUERY_PARAM_KEY;
  requiredQueryParams: FILTER_QUERY_PARAM_KEY[];
  excludingParameters: ExcludingParameter[];
}

@Injectable()
export class HostVisibilityService {
  private static INITIAL_CONDITIONS: QueryParamVisibilityCondition[] = [
    {
      queryParam: FILTER_QUERY_PARAM_KEY.size,
      requiredQueryParams: [FILTER_QUERY_PARAM_KEY.gender, FILTER_QUERY_PARAM_KEY.objectType],
      excludingParameters: [],
    },
  ];

  private bubbleListeners: VisibilityListener[] = [];
  private drawerListeners: VisibilityListener[] = [];

  private visibilityConditionsSubject = new BehaviorSubject<QueryParamVisibilityCondition[]>(HostVisibilityService.INITIAL_CONDITIONS);
  private subscriptions: Subscription;

  public constructor(
    @Inject(FILTER_PARAMETER_DRAFT_STORE_TOKEN) private drawerStore: FilterParameterStoreService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private bubbleStore: FilterParameterStoreService
  ) {}

  public init(): void {
    this.subscriptions = new Subscription();
    this.subscriptions.add(this.drawerStore.parameters$.subscribe(this.handleDrawerParametersChange.bind(this)));
    this.subscriptions.add(this.bubbleStore.parameters$.subscribe(this.handleBubbleParametersChange.bind(this)));
    this.subscriptions.add(this.visibilityConditionsSubject.subscribe(this.handleVisibilityConditionsChange.bind(this)));
  }

  public clear(): void {
    this.subscriptions.unsubscribe();
    this.visibilityConditionsSubject.next(HostVisibilityService.INITIAL_CONDITIONS);
    this.bubbleListeners = [];
    this.drawerListeners = [];
  }

  public addVisibilityConditions(conditions: QueryParamVisibilityCondition[]): void {
    let newConditions: QueryParamVisibilityCondition[] = [...this.visibilityConditionsSubject.getValue()];

    conditions.forEach((condition: QueryParamVisibilityCondition) => {
      const foundCondition: QueryParamVisibilityCondition = newConditions.find((cond) => cond.queryParam === condition.queryParam);
      if (!foundCondition) {
        newConditions.push(condition);
      } else {
        const newCondition: QueryParamVisibilityCondition = { ...foundCondition };

        newCondition.requiredQueryParams = [...newCondition.requiredQueryParams, ...condition.requiredQueryParams].filter(
          (value, index, array) => array.indexOf(value) === index
        );
        newCondition.excludingParameters = this.mergeExcludingParameters(newCondition.excludingParameters, condition.excludingParameters);

        newConditions = newConditions.filter((cond) => cond.queryParam !== newCondition.queryParam);
        newConditions.push(newCondition);
      }
    });

    this.visibilityConditionsSubject.next(newConditions);
  }

  public attach(host: FilterHostComponent): Observable<boolean> {
    const { filterConfig, variant } = host.hostConfig;
    const queryParams: FILTER_QUERY_PARAM_KEY[] = Object.values(filterConfig.mapKey);
    const subject = new BehaviorSubject(this.isHostVisible(queryParams, variant));

    const listener: VisibilityListener = {
      subject,
      host,
      queryParams,
    };

    if (variant === FILTER_VARIANT.BUBBLE) {
      this.bubbleListeners.push(listener);
    } else {
      this.drawerListeners.push(listener);
    }

    return subject.asObservable();
  }

  public detach(host: FilterHostComponent): void {
    const { variant } = host.hostConfig;

    if (variant === FILTER_VARIANT.BUBBLE) {
      this.bubbleListeners = this.bubbleListeners.filter((listener) => listener.host !== host);
    } else {
      this.drawerListeners = this.drawerListeners.filter((listener) => listener.host !== host);
    }
  }

  private isHostVisible(queryParams: FILTER_QUERY_PARAM_KEY[], variant: FILTER_VARIANT): boolean {
    const relatedConditions: QueryParamVisibilityCondition[] = this.visibilityConditionsSubject
      .getValue()
      .filter((condition) => queryParams.includes(condition.queryParam));

    for (const condition of relatedConditions) {
      if (!this.isConditionVisible(condition, variant)) {
        return false;
      }
    }

    return true;
  }

  private isConditionVisible(visibilityCondition: QueryParamVisibilityCondition, variant: FILTER_VARIANT): boolean {
    const store = variant === FILTER_VARIANT.BUBBLE ? this.bubbleStore : this.drawerStore;
    const { requiredQueryParams, excludingParameters } = visibilityCondition;

    return this.hasRequiredParams(requiredQueryParams, store) && this.hasValidValues(excludingParameters, store);
  }

  private hasRequiredParams(requiredQueryParams: FILTER_QUERY_PARAM_KEY[], store: FilterParameterStoreService): boolean {
    if (requiredQueryParams) {
      const requiredParams = store.getParametersByKeys(requiredQueryParams);
      if (requiredParams.length !== requiredQueryParams.length) {
        return false;
      }
    }

    return true;
  }

  private hasValidValues(excludingParameters: ExcludingParameter[], store: FilterParameterStoreService): boolean {
    if (excludingParameters) {
      const currentParams = store.getParametersByKeys(excludingParameters.map((excludingParam) => excludingParam.queryParam));

      for (const currentParam of currentParams) {
        const excludingParameter: ExcludingParameter = excludingParameters.find(
          (excludingParam) => excludingParam.queryParam === currentParam.key
        );

        if (excludingParameter.values.includes(currentParam.value) || currentParam.value.split(',').length > 1) {
          return false;
        }
      }
    }

    return true;
  }

  private handleDrawerParametersChange(): void {
    this.drawerListeners.forEach((listener) => this.updateListener(listener, FILTER_VARIANT.CONTENT));
  }

  private handleBubbleParametersChange(): void {
    this.bubbleListeners.forEach((listener) => this.updateListener(listener, FILTER_VARIANT.BUBBLE));
  }

  private handleVisibilityConditionsChange(): void {
    this.drawerListeners.forEach((listener) => this.updateListener(listener, FILTER_VARIANT.CONTENT));
    this.bubbleListeners.forEach((listener) => this.updateListener(listener, FILTER_VARIANT.BUBBLE));
  }

  private updateListener(listener: VisibilityListener, variant: FILTER_VARIANT): void {
    const currentVisibilityStatus = listener.subject.getValue();
    const newVisibilityStatus = this.isHostVisible(listener.queryParams, variant);

    if (currentVisibilityStatus !== newVisibilityStatus) {
      listener.subject.next(newVisibilityStatus);
    }
  }

  private mergeExcludingParameters(parameters1: ExcludingParameter[] = [], parameters2: ExcludingParameter[] = []): ExcludingParameter[] {
    return [...parameters1, ...parameters2].reduce((acc, excludingParameter) => {
      const existingParameter = acc.find((accExcludingParameter) => accExcludingParameter.queryParam === excludingParameter.queryParam);

      if (!existingParameter) {
        acc.push(excludingParameter);
      } else {
        existingParameter.values = [...existingParameter.values, ...excludingParameter.values].filter(
          (value, index, array) => array.indexOf(value) === index
        );
      }

      return acc;
    }, [] as ExcludingParameter[]);
  }
}
