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
    { label: '#xx', value: '#xx' },
  ];

  ngOnInit() {
    this.form.valueChanges.subscribe((val: string[]) => {
      console.log('hashtags', this.form.get('hashtags').value, 'searchedHashtags', this.form.get('searchedHashtags').value);
      const bindedValue = this.bindFormValues();
      //this.form.patchValue(bindedValue, { emitEvent: false });
      this.form.get('hashtags').patchValue(bindedValue, { emitEvent: false });
      this.form.get('searchedHashtags').patchValue(bindedValue, { emitEvent: false });
      console.log('value', this.form);
    });
  }

  public bindFormValues(): string[] {
    const loadedHashtags = this.form.get('hashtags').value;
    const searchedHashtags = this.form.get('searchedHashtags').value;

    let array = loadedHashtags.concat(searchedHashtags);
    array = [...new Set([...loadedHashtags, ...searchedHashtags])];

    console.log('a', array);
    return array;
  }
}
