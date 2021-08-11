import { CommonModule } from '@angular/common';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MOCK_HASHTAGS } from '@fixtures/hashtag.fixtures.spec';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiSelectFormComponent } from '@shared/form/components/multi-select-form/multi-select-form.component';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { of } from 'rxjs';
import { SuggesterInputComponent } from './suggester-input.component';
import { HASHTAG_EXTENDED_OPTIONS, HASHTAG_OPTIONS, HASHTAG_TESTING, INITIAL_HASHTAGS } from './suggester-input.fixtures.spec';

describe('SuggesterInputComponent', () => {
  let component: SuggesterInputComponent;
  let fixture: ComponentFixture<SuggesterInputComponent>;
  let inputElement: DebugElement;
  let hashtagSuggesterApiService: HashtagSuggesterApiService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [HashtagSuggesterApiService],
      imports: [CommonModule, HttpClientTestingModule, SelectFormModule, FormsModule, MultiSelectFormModule],
      declarations: [SuggesterInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggesterInputComponent);
    component = fixture.componentInstance;
    component.model = '';
    hashtagSuggesterApiService = TestBed.inject(HashtagSuggesterApiService);
    inputElement = fixture.debugElement.query(By.css('.SuggesterInput'));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initate component', () => {
    beforeEach(() => {
      component.writeValue(INITIAL_HASHTAGS);
      fixture.detectChanges();
    });
    it('should know the hashtags that are selected outside this component', () => {
      expect(component.value).toBe(INITIAL_HASHTAGS);
    });
  });

  describe('when user focus the input', () => {
    it('should have the placeholder changed to #', () => {
      inputElement.nativeElement.focus();

      expect(inputElement.nativeElement.placeholder).toBe('#');
    });
  });

  describe('when user unfocus the input', () => {
    it('should return the placeholder as initial', () => {
      inputElement.nativeElement.blur();

      expect(inputElement.nativeElement.placeholder).toBe($localize`:@@web_upload_hashtag_placeholder:Find or create a hashtag`);
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

        expect(component.model).toBe('#sss');
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

        expect(component.options[0].label).toBe(`#${inputValue}`);
        expect(component.options[1].label).toBe(`#${MOCK_HASHTAGS[0].text}`);
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

        expect(component.options[0].label).toBe(`#${inputValue}`);
        expect(component.options.length).toBe(1);
      }));
    });
  });

  describe('Select and unslect hashtag suggestions', () => {
    describe('when we change the input checkbox', () => {
      it('should be able to update the value', fakeAsync(() => {
        spyOn(component, 'handleSelectedOption').and.callThrough();
        spyOn(component, 'onChange');
        spyOn(component.multiSelectFormComponent.extendedOptions$, 'subscribe').and.returnValue(of(HASHTAG_EXTENDED_OPTIONS));
        component.value = [HASHTAG_OPTIONS[0].label, '#aa', '#bb'];
        const form = fixture.debugElement.query(By.directive(MultiSelectFormComponent));

        component.multiSelectFormComponent.extendedOptions$.subscribe();
        tick(1000);
        fixture.detectChanges();
        form.triggerEventHandler('change', {});

        expect(component.handleSelectedOption).toBeCalled();
        expect(component.onChange).toHaveBeenCalledWith([HASHTAG_OPTIONS[0].label, '#aa', '#bb']);
      }));
    });
  });

  describe('Close form', () => {
    it('should close the form when we click outside of the form', () => {
      spyOn(component, 'notShowOptions');

      const event: any = {
        target: component.formMenu.nativeElement as HTMLElement,
      };

      component.onWindowClick(event);
      fixture.detectChanges();

      expect(component.notShowOptions).toHaveBeenCalled();
    });

    it('should close the form when we press Escape', () => {
      spyOn(component, 'notShowOptions');

      inputElement.triggerEventHandler('keyup', { key: 'Escape' });
      fixture.detectChanges();

      expect(component.notShowOptions).toHaveBeenCalled();
    });
  });
});
