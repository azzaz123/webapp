export interface FilterConfig<T> {
  id: string;
  title: string;
  icon?: string;
  isClearable?: boolean;
  actions?: {
    apply?: boolean;
  };
  mapKey: T;
}
