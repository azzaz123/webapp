import { FilterOptionGroupId } from '../types/filter-option-group-id';

export interface FilterOption {
  value: string | Record<string, string>;
  label: string;
  icon?: string;
  children?: FilterOption[];
  groupId?: FilterOptionGroupId;
}
