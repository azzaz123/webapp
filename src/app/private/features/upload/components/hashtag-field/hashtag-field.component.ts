import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { pairwise, startWith } from 'rxjs/operators';

@Component({
  selector: 'tsl-hashtag-field',
  templateUrl: './hashtag-field.component.html',
  styleUrls: ['./hashtag-field.component.scss'],
})
export class HashtagFieldComponent implements OnInit {
  @Input() options: SelectFormOption<string>[];
  @Input() form: FormGroup;
  @Input() controlName: FormControlName;
  @Output() start = new EventEmitter<string>();
  @ViewChild('generalHashtagForm') generalHashtagForm: ElementRef;
  public maxHashtagsNumber: number = 5;
  public page: number = 0;
  /* public disabled: boolean = (this.form.value.hashtags.length === this.maxHashtagsNumber) */
  public searchedOptions = [
    { label: '#searched', value: '#searched' },
    { label: '#faa', value: '#faa' },
    { label: '#d', value: '#d' },
    { label: '#xx', value: '#xx' },
  ];

  ngOnInit() {
    this.form.valueChanges.pipe(startWith({ hashtags: [], searchedHashtags: [] }), pairwise()).subscribe(([prev, next]) => {
      this.onChangeFormControlValue(prev, next);
      // Check which one has changed

      /*   this.form.get('hashtags').patchValue(bindedValue, { emitEvent: false });
      this.form.get('searchedHashtags').patchValue(bindedValue, { emitEvent: false });
      console.log('value', this.form); */
    });
  }

  private onChangeFormControlValue(prev, next): void {
    console.log(prev, next);
    let newValue = [];
    // Compare the property of object
  }

  public bindFormValues(): string[] {
    const loadedHashtags = this.form.get('hashtags').value;
    const searchedHashtags = this.form.get('searchedHashtags').value;

    let array = loadedHashtags.concat(searchedHashtags);
    array = [...new Set([...loadedHashtags, ...searchedHashtags])];

    console.log('a', array);
    return array;
  }

  public loadMore(event): void {
    if ((event.target.scrollTop = event.target.offsetTop)) {
      this.page++;
      this.start.emit(this.page.toString());
      return;
    }
  }
}
