import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { CheckboxFormComponent } from './checkbox-form.component';

describe('CheckboxFormComponent', () => {
  let component: CheckboxFormComponent;
  let fixture: ComponentFixture<CheckboxFormComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [CheckboxFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CheckboxFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('when user clicks', () => {
    const checkboxClick = () => {
      el.querySelector('input').click();
    };

    describe('and had no value', () => {
      it('should has true as value', () => {
        checkboxClick();

        expect(component.value).toBeTruthy();
      });
    });

    describe('and value was true', () => {
      beforeEach(() => {
        component.value = true;
        fixture.detectChanges();
      });

      it('should has false as value', () => {
        checkboxClick();

        expect(component.value).toBeFalsy();
      });
    });

    describe('and value was false', () => {
      beforeEach(() => {
        component.value = false;
        fixture.detectChanges();
      });

      it('should has true as value', () => {
        checkboxClick();

        expect(component.value).toBeTruthy();
      });
    });
  });
});
