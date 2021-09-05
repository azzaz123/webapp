import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormControlName, FormGroup } from '@angular/forms';
import { SelectFormOption } from '@shared/form/components/select/interfaces/select-form-option.interface';
import { distinctUntilChanged, pairwise, startWith } from 'rxjs/operators';

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
    this.form.valueChanges
      .pipe(startWith({ hashtags: [], searchedHashtags: [] }), distinctUntilChanged() /**for the emitEvent */, pairwise())
      .subscribe(([prev, next]) => {
        const onChangeForm = this.onChangeFormControlValue(prev, next);
        const newValue = onChangeForm.newValue;
        const formToBePatched = onChangeForm.formToBePatched;
        console.log('final newValue', newValue, formToBePatched, this.form.get('hashtags').value, this.form.get('searchedHashtags').value);
        this.form.get(formToBePatched).patchValue(newValue, { emitEvent: false }); // Problem might be here, change this code to the code below
        // this.form.patchValue(next, { emitEvent: true });
        console.log(this.form.controls.hashtags);
      });
  }

  private onChangeFormControlValue(prev, next): { newValue: string[]; formToBePatched: string } {
    console.log(prev, next);
    let newValue = [];
    let formToBePatched: string;
    let modifiedForm: string;
    // Compare the property of object and only patch the one that is not changed
    if (prev.hashtags.length !== next.hashtags.length) {
      console.log('hashtags changed', prev, next);
      formToBePatched = 'searchedHashtags';
      modifiedForm = 'hashtags';
      /*  let formToBePatched = 'searchedHashtags'; */
      /*   if (next['hashtags'].length > prev['hashtags'].length) {
        const lastItemIndex = next['hashtags'].length - 1;
        const newSelected = next['hashtags'][lastItemIndex];
        // Add it and remove the repeated value (Add it and remove it if it was already selected)
        next['searchedHashtags'].push(newSelected);
        next['searchedHashtags'] = next['searchedHashtags'].filter((item, pos, self) => self.indexOf(item) === pos); // Remove repeate value
        newValue = next['searchedHashtags'];
        console.log('add', newValue);
        return { newValue, formToBePatched };
      } else {
        const hashtagToRemove = prev['hashtags'].find((n) => {
          return !next['hashtags'].includes(n);
        });

        newValue = next['searchedHashtags'].filter((n) => {
          return n !== hashtagToRemove;
        });
        console.log('remove', newValue);
        return { newValue, formToBePatched };
      } */
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
    if (next[modifiedForm].length > prev[modifiedForm].length) {
      const lastItemIndex = next['hashtags'].length - 1;
      const newSelected = next['hashtags'][lastItemIndex];
      // Add it and remove the repeated value (Add it and remove it if it was already selected)
      next['searchedHashtags'].push(newSelected);
      next['searchedHashtags'] = next['searchedHashtags'].filter((item, pos, self) => self.indexOf(item) === pos); // Remove repeate value
      newValue = next['searchedHashtags'];
      console.log('add', newValue);
      return { newValue, formToBePatched };
    } else {
      const hashtagToRemove = prev['hashtags'].find((n) => {
        return !next['hashtags'].includes(n);
      });

      newValue = next['searchedHashtags'].filter((n) => {
        return n !== hashtagToRemove;
      });
      console.log('remove', newValue);
      return { newValue, formToBePatched };
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
