import { ConfigurationId } from '../types/configuration-id.type';

export type ValueOf<T> = T[keyof T];

export interface FilterIdConfiguration {
  bubble: ValueOf<ConfigurationId>[];
  drawer: ValueOf<ConfigurationId>[];
}
