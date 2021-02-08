export interface FilterConfig {
  title: string;
  isClearable?: boolean;
  actions?: {
    apply?: boolean;
    cancel?: boolean;
  };
}
