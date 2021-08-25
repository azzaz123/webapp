import { Component, Input, OnInit } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { AbstractFormComponent } from '@shared/form/abstract-form/abstract-form-component';
import { MultiSelectValue } from '@shared/form/components/multi-select-form/interfaces/multi-select-value.type';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';

@Component({
  selector: 'tsl-hashtag-field',
  templateUrl: './hashtag-field.component.html',
  styleUrls: ['./hashtag-field.component.scss'],
})
export class HashtagFieldComponent extends AbstractFormComponent<MultiSelectValue> {
  @Input() options: SelectFormOption<string>[];
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  public maxHashtagsNumber: number = 5;

  public writeValue(value: MultiSelectValue): void {
    this.value = value;
  }
}
