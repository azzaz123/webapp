export interface FilterConfig {
  id: string;
  title: string;
  icon?: string;
  isClearable?: boolean;
  actions?: {
    apply?: boolean;
    cancel?: boolean;
  };
}
