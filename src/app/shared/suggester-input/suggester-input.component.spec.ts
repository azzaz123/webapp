import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HashtagSuggesterApiService } from '@private/features/upload/core/services/hashtag-suggestions/hashtag-suggester-api.service';
import { MultiSelectFormModule } from '@shared/form/components/multi-select-form/multi-select-form.module';
import { SelectFormModule } from '@shared/form/components/select/select-form.module';
import { SuggesterInputComponent } from './suggester-input.component';
import { HASHTAG_TESTING } from './suggester-input.fixtures.spec';

describe('SuggesterInputComponent', () => {
  let component: SuggesterInputComponent;
  let fixture: ComponentFixture<SuggesterInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [HashtagSuggesterApiService],
      imports: [CommonModule, HttpClientModule, SelectFormModule, FormsModule, MultiSelectFormModule],
      declarations: [SuggesterInputComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SuggesterInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when initate component', () => {
    it('should know the hashtags that are selected outside this component', () => {});
  });

  describe('when user focus the input', () => {
    it('should have the placeholder changed to #', () => {});
  });

  describe('when user unfocus the input', () => {
    it('should return the placeholder as initial', () => {});
  });

  describe('when user type in the input', () => {
    describe.each(HASHTAG_TESTING.isValid)('Check whether the hashtag is valid', (isValid) => {
      it(`should pass the test if input is ${isValid}`, () => {
        spyOn(component, 'detectTitleKeyboardChanges').and.callThrough();
        spyOn(component, 'isValidKey').and.callThrough();
        const inputElement = fixture.debugElement.query(By.css('.SuggesterInput'));

        inputElement.nativeElement.value = isValid;
        inputElement.nativeElement.dispatchEvent(new Event('input'));
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
        const inputElement = fixture.debugElement.query(By.css('.SuggesterInput'));

        inputElement.nativeElement.value = isNotValid;
        inputElement.nativeElement.dispatchEvent(new Event('input'));
        inputElement.triggerEventHandler('keyup', {});
        fixture.detectChanges();
        component.isValidKey();

        expect(component.isValidKey()).toBeFalsy();
      });
    });

    describe('the input value', () => {
      it('should have the # symbol infront of the value entered by the user', () => {});
    });

    describe('when we have the hashtag suggestions', () => {
      it('should load the hashtags from our endpoint', () => {});

      it('the hashtags should have # infront', () => {});
    });

    describe('when we do not have the hashtags suggestions', () => {
      it('should create new hashtag for user', () => {});

      it('ths hashtage should have # infront', () => {});
    });
  });

  describe('Select and unslect hashtag suggestions', () => {
    describe('when select the hashtag', () => {
      it('should add the selected hashtag to the hashtag list', () => {});
    });

    describe('when unselect the hashtag', () => {
      it('should remove the hashtag from the hashtag list', () => {});
    });
  });
});
