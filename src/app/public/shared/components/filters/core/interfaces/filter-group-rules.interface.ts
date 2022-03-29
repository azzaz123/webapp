import { FILTER_QUERY_PARAM_KEY } from '../../enums/filter-query-param-key.enum';
import { ConfigurationId } from '../types/configuration-id.type';

export interface FilterGroupRules {
  reload?: [
    {
      parentParamKey: FILTER_QUERY_PARAM_KEY;
      childFilterConfigId: ConfigurationId[keyof ConfigurationId];
    }
  ];
}
