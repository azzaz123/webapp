import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { FindValueSubscriber } from 'rxjs/internal/operators/find';
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
    // this.detectFormControls();
    this.form.valueChanges.pipe(startWith({ hashtags: [], searchedHashtags: [] }), pairwise()).subscribe(([prev, next]) => {
      const onChangeForm = this.onChangeFormControlValue(prev, next);
      const newValue = onChangeForm.newValue;
      const formToBePatched = onChangeForm.formToBePatched;
      console.log('final newValue', newValue, formToBePatched, this.form.get('hashtags').value, this.form.get('searchedHashtags').value);
      this.form.get(formToBePatched).patchValue(newValue, { emitEvent: false });
      console.log(this.form.controls.hashtags);
    });
    /* 
    this.form.valueChanges.subscribe(() => {
      this.form.get('hashtags').patchValue(this.bindFormValues(), { emitEvent: false });
      this.form.get('searchedHashtags').patchValue(this.bindFormValues(), { emitEvent: false });
    }); */
  }

  private onChangeFormControlValue(prev, next): { newValue: string[]; formToBePatched: string } {
    console.log(prev, next);
    let newValue = [];
    // Compare the property of object and only patch the one that is not changed
    if (prev.hashtags.length !== next.hashtags.length) {
      console.log('hashtags changed', prev, next);
      let formToBePatched = 'searchedHashtags';
      //   this.form.patchValue(this.bindFormValues(), { emitEvent: false });
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
    } else if (prev.searchedHashtags.length !== next.searchedHashtags.length) {
      console.log('searchedHashtags changed', prev, next);
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
        console.log('searchedHashtags remove', newValue);
        return { newValue, formToBePatched };
      }
    } else {
      console.log('NON ABOVE');
      return;
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
