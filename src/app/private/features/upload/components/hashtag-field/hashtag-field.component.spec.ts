import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { MultiselectSearchInputModule } from '@shared/multiselect-search-input/multiselect-search-input.module';

import { HashtagFieldComponent } from './hashtag-field.component';

describe('HashtagFieldComponent', () => {
  let component: HashtagFieldComponent;
  let fixture: ComponentFixture<HashtagFieldComponent>;
  let fb: FormBuilder;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MultiselectSearchInputModule, HttpClientTestingModule, MultiSelectFormModule, ReactiveFormsModule],
      declarations: [HashtagFieldComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagFieldComponent);
    fb = TestBed.inject(FormBuilder);
    component = fixture.componentInstance;
    component.form = fb.group({
      hashtags: [[]],
      searchedHashtags: [[]],
    });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Multiselect behavior with two forms', () => {
    describe('When we check general hashtag', () => {
      it('should also check in the same option in search hashtags', fakeAsync(() => {
        component.form.controls.hashtags.patchValue(['aa']);

        tick();

        expect(component.form.value.searchedHashtags).toStrictEqual(['aa']);
      }));
    });
    describe('When we continually check the option in search hashtags', () => {
      it('should also check the same option in general hashtags', fakeAsync(() => {
        component.form.controls.hashtags.patchValue(['aa']);
        component.form.controls.searchedHashtags.patchValue(['aa', 'cc']);

        tick();

        expect(component.form.value.hashtags).toStrictEqual(['aa', 'cc']);
      }));
    });
    describe('When we uncheck the general hashtags', () => {
      it('should also uncheck in the same option in search hashtags', fakeAsync(() => {
        component.form.controls.hashtags.patchValue([]);

        tick();

        expect(component.form.value.searchedHashtags).toStrictEqual([]);
      }));
    });
  });
});
