import { ConfigurationId } from '../types/configuration-id.type';
import { FilterGroupRules } from './filter-group-rules.interface';

export type ValueOf<T> = T[keyof T];

export interface BubbleDrawerConfiguration {
  bubble: ValueOf<ConfigurationId>[];
  drawer: ValueOf<ConfigurationId>[];
  rules?: FilterGroupRules;
}
