import { SelectFormOption } from '../../select/interfaces/select-form-option.interface';

export interface MultiSelectFormOption extends SelectFormOption<string> {
  children?: MultiSelectFormOption[];
}

export interface TemplateMultiSelectFormOption extends MultiSelectFormOption {
  checked: boolean;
}
