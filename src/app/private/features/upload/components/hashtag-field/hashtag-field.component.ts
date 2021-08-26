import { Component, Input, OnInit } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';

@Component({
  selector: 'tsl-hashtag-field',
  templateUrl: './hashtag-field.component.html',
  styleUrls: ['./hashtag-field.component.scss'],
})
export class HashtagFieldComponent implements OnInit {
  @Input() options: SelectFormOption<string>[];
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  public maxHashtagsNumber: number = 5;
  /* public disabled: boolean = (this.form.value.hashtags.length === this.maxHashtagsNumber) */
  public searchedOptions = [
    { label: '#searched', value: '#searched' },
    { label: '#faa', value: '#faa' },
    { label: '#d', value: '#d' },
  ];

  ngOnInit() {
    this.form.valueChanges.subscribe((val: string[]) => {
      this.form.patchValue(val, { emitEvent: false });
    });
  }
}
