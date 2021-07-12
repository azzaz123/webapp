import { SelectFormOption } from '../../select/interfaces/select-form-option.interface';

export interface MultiSelectFormOption extends SelectFormOption<string> {
  checked: boolean;
}
