import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
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
      imports: [
        CommonModule,
        HttpClientModule,
        NgbTypeaheadModule,
        SelectFormModule,
        ReactiveFormsModule,
        FormsModule,
        MultiSelectFormModule,
      ],
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
});
