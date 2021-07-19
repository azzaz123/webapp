import { HttpClientTestingModule } from '@angular/common/http/testing';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { SvgIconModule } from '@shared/svg-icon/svg-icon.module';
import { MultiSelectFormOption } from '../../interfaces/multi-select-form-option.interface';
import { MultiSelectOptionComponent } from './multi-select-option.component';

export const optionFixture: MultiSelectFormOption = {
  label: 'aa',
  value: 'aa',
  checked: true,
};

export const optionWithSublabelFixture: MultiSelectFormOption = {
  label: 'bb',
  sublabel: '3',
  value: 'bb',
  checked: true,
};

describe('MultiSelectOptionComponent', () => {
  let component: MultiSelectOptionComponent;
  let debugElement: DebugElement;
  let fixture: ComponentFixture<MultiSelectOptionComponent>;
  const queryLabelNode = '.MultiSelectOption__label';
  const querySublabel = '.MultiSelectOption__label__sub';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule, SvgIconModule, HttpClientTestingModule],
      declarations: [MultiSelectOptionComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MultiSelectOptionComponent);
    debugElement = fixture.debugElement;
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when option', () => {
    describe('...does not have sub label', () => {
      beforeEach(() => {
        component.option = optionFixture;
        fixture.detectChanges();
      });
      it('should only show option with label', () => {
        const label = debugElement.query(By.css(queryLabelNode)).nativeElement;
        const subLabel = debugElement.query(By.css(querySublabel));

        expect(label.innerHTML).toBe(optionFixture.label);
        expect(subLabel).toBeNull();
      });
    });

    describe('...has sublabel', () => {
      beforeEach(() => {
        component.option = optionWithSublabelFixture;
        fixture.detectChanges();
      });

      it('should show option with label and sublabel', () => {
        const label = debugElement.query(By.css(queryLabelNode)).nativeElement;
        const sublabel = debugElement.query(By.css(querySublabel)).nativeElement;

        expect(label.innerHTML).toBe(optionWithSublabelFixture.label);
        expect(sublabel.innerHTML).toBe(optionWithSublabelFixture.sublabel);
      });
    });

    describe('...is toggled by the user', () => {
      it('should toggle checkbox ', () => {
        spyOn(component.toggleOnChange, 'emit');
        const checkbox = debugElement.nativeElement.querySelector('input[type=checkbox]');

        checkbox.click();

        expect(component.toggleOnChange.emit).toHaveBeenCalledTimes(1);
      });
    });

    describe('...disabled checking behavior', () => {
      beforeEach(() => {
        component.option = optionFixture;
        component.disabled = true;
        fixture.detectChanges();
      });
      it('should disable checking behavior if we stop user checking the option', () => {
        const checkbox = debugElement.nativeElement.querySelector('input[type=checkbox]');

        expect(checkbox.disabled).toBeTruthy();
      });
    });
  });
});
