export interface FilterOption {
  value: string | Record<string, string>;
  label: string;
  icon?: string;
  children?: FilterOption[];
}
