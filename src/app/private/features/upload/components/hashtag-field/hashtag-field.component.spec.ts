import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginatedList } from '@api/core/model';
import { MOCK_HASHTAGS } from '@fixtures/hashtag.fixtures.spec';
import { MultiSelectFormOption } from '@shared/form/components/multi-select-form/interfaces/multi-select-form-option.interface';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { MultiselectSearchInputComponent } from '@shared/form/components/multiselect-search-input/multiselect-search-input.component';
import { Observable, of } from 'rxjs';
import { Hashtag } from '../../core/models/hashtag.interface';
import { HashtagSuggesterApiService } from '../../core/services/hashtag-suggestions/hashtag-suggester-api.service';

import { HashtagFieldComponent, HASHTAG_TYPE } from './hashtag-field.component';

describe('HashtagFieldComponent', () => {
  let component: HashtagFieldComponent;
  let fixture: ComponentFixture<HashtagFieldComponent>;
  let options: MultiSelectFormOption[];
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule, HttpClientTestingModule, MultiSelectFormModule, ReactiveFormsModule],
      declarations: [HashtagFieldComponent, MultiselectSearchInputComponent],
      providers: [
        {
          provide: HashtagSuggesterApiService,
          useValue: {
            getHashtags(): Observable<PaginatedList<Hashtag, string>> {
              return of({
                list: MOCK_HASHTAGS,
              });
            },
            getHashtagsByPrefix(): Observable<PaginatedList<Hashtag, string>> {
              return of({
                list: MOCK_HASHTAGS,
              });
            },
          },
        },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HashtagFieldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.suggestedOptions$.subscribe((opts) => {
      options = opts;
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('Multiselect behavior with two hashtagForms', () => {
    describe('When we check general hashtag', () => {
      it('should also check in the same option in search hashtags', () => {
        const value = options[0].value;
        component.hashtagForm.controls[HASHTAG_TYPE.SUGGESTED].setValue([value]);

        expect(component.hashtagForm.value[HASHTAG_TYPE.SEARCHED]).toStrictEqual([value]);
      });
    });

    describe('When we uncheck the general hashtags', () => {
      it('should also uncheck in the same option in search hashtags', () => {
        component.hashtagForm.controls[HASHTAG_TYPE.SUGGESTED].setValue([]);

        expect(component.hashtagForm.value[HASHTAG_TYPE.SEARCHED]).toStrictEqual([]);
      });
    });
  });
});
