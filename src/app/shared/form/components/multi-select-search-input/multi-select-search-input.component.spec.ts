import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MOCK_HASHTAGS } from '@fixtures/hashtag.fixtures.spec';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { of } from 'rxjs';
import { MultiselectSearchInputComponent } from './multi-select-search-input.component';
import { HASHTAG_EXTENDED_OPTIONS, HASHTAG_TESTING, INITIAL_HASHTAGS } from './multi-select-search-input.fixtures.spec';

describe('MultiselectSearchInputComponent', () => {
  let component: MultiselectSearchInputComponent;
  let fixture: ComponentFixture<MultiselectSearchInputComponent>;
  let inputElement: DebugElement;
  let multiselectElement: DebugElement;
  let hashtagSuggesterApiService: HashtagSuggesterApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [HashtagSuggesterApiService],
      imports: [CommonModule, HttpClientTestingModule, SelectFormModule, FormsModule, MultiSelectFormModule],
      declarations: [MultiselectSearchInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiselectSearchInputComponent);
    component = fixture.componentInstance;
    component.searchValue = '';
    hashtagSuggesterApiService = TestBed.inject(HashtagSuggesterApiService);
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.css('.MultiselectSearchInput'));
    multiselectElement = fixture.debugElement.query(By.css('tsl-multi-select-form'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initate component', () => {
    beforeEach(() => {
      component.writeValue(INITIAL_HASHTAGS);
      fixture.detectChanges();
    });
  });

  describe('when user focus the input', () => {
    it('should have the placeholder changed to #', () => {
      inputElement.nativeElement.focus();
      fixture.detectChanges();

      expect(inputElement.nativeElement.placeholder).toBe('#');
    });
  });

  describe('when user unfocus the input', () => {
    it('should return the placeholder as initial', () => {
      inputElement.nativeElement.blur();

      expect(inputElement.nativeElement.placeholder).toBe($localize`:@@hashtags_view_search_bar_placeholder:Find or create a hashtag`);
    });
  });

  describe('when user type in the input', () => {
    describe.each(HASHTAG_TESTING.isValid)('Check whether the hashtag is valid', (isValid) => {
      it(`should pass the test if input is ${isValid}`, () => {
        spyOn(component, 'detectTitleKeyboardChanges').and.callThrough();
        spyOn(component, 'isValidKey').and.callThrough();

        inputElement.nativeElement.value = isValid;
        inputElement.triggerEventHandler('keyup', {});
        fixture.detectChanges();
        component.isValidKey();

        expect(component.isValidKey()).toBeTruthy();
      });
    });

    describe.each(HASHTAG_TESTING.isNotValid)('Check whether the hashtag is not valid', (isNotValid) => {
      it(`should pass the test if input is ${isNotValid}`, () => {
        spyOn(component, 'detectTitleKeyboardChanges').and.callThrough();
        spyOn(component, 'isValidKey').and.callThrough();

        inputElement.nativeElement.value = isNotValid;
        inputElement.nativeElement.dispatchEvent(new Event('input'));
        inputElement.triggerEventHandler('keyup', {});
        fixture.detectChanges();
        component.isValidKey();

        expect(component.isValidKey()).toBeFalsy();
      });
    });

    describe('the input value', () => {
      it('should have the # symbol infront of the value entered by the user', () => {
        inputElement.nativeElement.value = 'sss';
        inputElement.nativeElement.dispatchEvent(new Event('input'));

        inputElement.triggerEventHandler('keyup', {});
        fixture.detectChanges();

        expect(component.searchValue).toBe('#sss');
      });
    });

    describe('when we have the hashtag suggestions', () => {
      it('should load the hashtags from our endpoint with our input value and hashtags should have # in front', fakeAsync(() => {
        spyOn(hashtagSuggesterApiService, 'getHashtagsByPrefix').and.returnValue(of({ list: MOCK_HASHTAGS, paginationParameter: '10' }));
        spyOn(component, 'detectTitleKeyboardChanges').and.callThrough();
        const event = new KeyboardEvent('keyup', {});
        const inputValue = 'ff';

        component.writeValue([]);
        inputElement.nativeElement.value = inputValue;
        inputElement.nativeElement.dispatchEvent(event);
        inputElement.nativeElement.dispatchEvent(new Event('input'));
        inputElement.triggerEventHandler('keyup', {});

        tick(750);
        fixture.detectChanges();

        component.options$.subscribe((options) => {
          expect(options[0].label).toBe(`#${inputValue}`);
          expect(options[1].label).toBe(`#${MOCK_HASHTAGS[0].text}`);
        });
      }));
    });

    describe('when we do not have the hashtags suggestions', () => {
      it('should create new hashtag for user with hashtag # symbol in front', fakeAsync(() => {
        spyOn(hashtagSuggesterApiService, 'getHashtagsByPrefix').and.returnValue(of({ list: [] }));
        spyOn(component, 'detectTitleKeyboardChanges').and.callThrough();
        const event = new KeyboardEvent('keyup', {});
        const inputValue = 'ff';

        component.writeValue([]);
        inputElement.nativeElement.value = inputValue;
        inputElement.nativeElement.dispatchEvent(event);
        inputElement.nativeElement.dispatchEvent(new Event('input'));
        inputElement.triggerEventHandler('keyup', {});

        tick(750);
        fixture.detectChanges();

        component.options$.subscribe((options) => {
          expect(options[0].label).toBe(`#${inputValue}`);
          expect(options.length).toBe(1);
        });
      }));
    });
  });

  describe('Select and unslect hashtag suggestions', () => {
    describe('when we change the input checkbox', () => {
      it('should be able to update the value', () => {
        spyOn(component, 'onChange');
        spyOn(hashtagSuggesterApiService, 'getHashtagsByPrefix').and.returnValue(of({ list: MOCK_HASHTAGS, paginationParameter: '10' }));
        component.suggestions = [MOCK_HASHTAGS[0].text];

        multiselectElement.triggerEventHandler('change', null);

        expect(component.onChange).toHaveBeenCalledWith([MOCK_HASHTAGS[0].text]);
      });
    });
  });

  describe('Close form', () => {
    it('should close the form when we click outside of the form', () => {
      spyOn(component, 'emptyOptions');

      const event: any = {
        target: component.hashtagSuggesterOptions.nativeElement as HTMLElement,
      };

      component.onWindowClick(event);
      fixture.detectChanges();

      expect(component.emptyOptions).toHaveBeenCalled();
    });

    it('should close the form when we press Escape', () => {
      spyOn(component, 'emptyOptions');

      inputElement.triggerEventHandler('keyup', { key: 'Escape' });
      fixture.detectChanges();

      expect(component.emptyOptions).toHaveBeenCalled();
    });
  });
});
