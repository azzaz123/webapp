import { Component, Input } from '@angular/core';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { ComplexSelectValue } from '../select/types/complex-select-value';

@Component({
  selector: 'tsl-multi-select-form',
  templateUrl: './multi-select-form.component.html',
  styleUrls: ['./multi-select-form.component.scss'],
})
export class MultiSelectFormComponent extends AbstractFormComponent<ComplexSelectValue> {
  @Input() options: string[];
}
