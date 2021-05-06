import { Inject, Injectable, OnDestroy, OnInit } from '@angular/core';
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

interface QueryParamVisibilityCondition {
  queryParam: FILTER_QUERY_PARAM_KEY;
  requiredQueryParams?: FILTER_QUERY_PARAM_KEY[];
  excludingParameters?: ExcludingParameter[];
}

@Injectable()
export class HostVisibilityService implements OnInit, OnDestroy {
  private static INITIAL_CONDITIONS: QueryParamVisibilityCondition[] = [
    {
      queryParam: FILTER_QUERY_PARAM_KEY.size,
      requiredQueryParams: [FILTER_QUERY_PARAM_KEY.gender],
    },
  ];

  private bubbleListeners: VisibilityListener[] = [];
  private drawerListeners: VisibilityListener[] = [];

  private visibilityConditionsSubject = new BehaviorSubject<QueryParamVisibilityCondition[]>(HostVisibilityService.INITIAL_CONDITIONS);
  private subscriptions = new Subscription();

  public constructor(
    @Inject(FILTER_PARAMETER_DRAFT_STORE_TOKEN) private drawerStore: FilterParameterStoreService,
    @Inject(FILTER_PARAMETER_STORE_TOKEN) private bubbleStore: FilterParameterStoreService
  ) {}

  public ngOnInit(): void {
    this.subscriptions.add(this.drawerStore.parameters$.subscribe(this.handleDrawerParametersChange));
    this.subscriptions.add(this.bubbleStore.parameters$.subscribe(this.handleBubbleParametersChange));
    this.subscriptions.add(this.visibilityConditionsSubject.subscribe(this.handleVisibilityConditionsChange));
  }

  public ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  public addVisibilityCondition(condition: QueryParamVisibilityCondition): void {
    const newConditions = [...this.visibilityConditionsSubject.getValue()];

    const foundCondition = newConditions.find((cond) => cond.queryParam === condition.queryParam);

    if (!foundCondition) {
      newConditions.push(condition);
    } else {
      foundCondition.requiredQueryParams = [...foundCondition.requiredQueryParams, ...condition.requiredQueryParams].filter(
        (value, index, array) => array.indexOf(value) === index
      );
      foundCondition.excludingParameters = this.mergeExcludingParameters(foundCondition.excludingParameters, condition.excludingParameters);
    }

    this.visibilityConditionsSubject.next(newConditions);
  }

  public attach(host: FilterHostComponent): Observable<boolean> {
    const { filterConfig, variant } = host.hostConfig;
    const queryParams = Object.values(filterConfig.mapKey);
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
    const relatedConditions = this.visibilityConditionsSubject.getValue().filter((condition) => queryParams.includes(condition.queryParam));

    relatedConditions.forEach((condition) => {
      if (!this.isConditionVisible(condition, variant)) {
        return false;
      }
    });

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

      currentParams.forEach((currentParam) => {
        const excludingParameter = excludingParameters.find((excludingParam) => excludingParam.queryParam === currentParam.key);

        if (excludingParameter.values.includes(currentParam.value)) {
          return false;
        }
      });
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

  private mergeExcludingParameters(parameters1: ExcludingParameter[], parameters2: ExcludingParameter[]): ExcludingParameter[] {
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
