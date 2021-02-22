export interface FilterConfig<T extends Record<string, string>> {
  id: string;
  title: string;
  icon?: string;
  isClearable?: boolean;
  actions?: {
    apply?: boolean;
  };
  bubblePlaceholder: string;
  drawerPlaceholder?: string;
  mapKey: T;
}
