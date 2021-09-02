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
    this.detectFormControls();
    this.form.valueChanges.pipe(startWith({ hashtags: [], searchedHashtags: [] }), pairwise()).subscribe(([prev, next]) => {
      const newValue = this.onChangeFormControlValue(prev, next).newValue;
      const formToBePatched = this.onChangeFormControlValue(prev, next).formToBePatched;
      console.log('final newValue', this.onChangeFormControlValue(prev, next));
      this.form.get(formToBePatched).patchValue(newValue);
      console.log(this.form.controls.hashtags);
    });
  }

  private detectFormControls() {
    this.form.get('hashtags').valueChanges.subscribe((n) => {
      console.log('hashtags', n);
    });

    this.form.get('searchedHashtags').valueChanges.subscribe((n) => {
      console.log('searched', n);
    });
  }

  private onChangeFormControlValue(prev, next): { newValue: string[]; formToBePatched: string } {
    console.log(prev, next);
    let newValue = [];
    // Compare the property of object and only patch the one that is not changed
    if (prev['hashtags'] !== next['hashtags']) {
      let formToBePatched = 'searchedHashtags';
      if (next['hashtags'].length > prev['hashtags'].length) {
        const lastItemIndex = next['hashtags'].length - 1;
        const newSelected = next['hashtags'][lastItemIndex];
        next['searchedHashtags'].push(newSelected);
        newValue = next['searchedHashtags'];
        console.log('add', newValue);
        return { newValue, formToBePatched };
      } else {
        next['searchedHashtags'].pop();
        newValue = next['searchedHashtags'];
        console.log('remove', newValue);
        return { newValue, formToBePatched };
      }
    } else if (prev['searchedHashtags'] !== next['searchedHashtags']) {
      let formToBePatched = 'hashtags';
      if (next['searchedHashtags'].length > prev['searchedHashtags'].length) {
        const lastItemIndex = next['searchedHashtags'].length - 1;
        const newSelected = next['searchedHashtags'][lastItemIndex];
        next['hashtags'].push(newSelected);
        newValue = next['hashtags'];
        console.log('add', newValue);
        return { newValue, formToBePatched };
      } else {
        next['hashtags'].pop();
        newValue = next['hashtags'];
        console.log('remove', newValue);
        return { newValue, formToBePatched };
      }
    }
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
