import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ToggleFormComponent } from './toggle-form.component';

describe('ToggleFormComponent', () => {
  let component: ToggleFormComponent;
  let fixture: ComponentFixture<ToggleFormComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule, FormsModule],
      declarations: [ToggleFormComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ToggleFormComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  describe('when user clicks', () => {
    const toggleClick = () => {
      el.querySelector('input').click();
    };

    describe('and had no value', () => {
      it('should has true as value', () => {
        toggleClick();

        expect(component.value).toBeTruthy();
      });
    });

    describe('and value was true', () => {
      beforeEach(() => {
        component.value = true;
        fixture.detectChanges();
      });

      it('should has false as value', () => {
        toggleClick();

        expect(component.value).toBeFalsy();
      });
    });

    describe('and value was false', () => {
      beforeEach(() => {
        component.value = false;
        fixture.detectChanges();
      });

      it('should has true as value', () => {
        toggleClick();

        expect(component.value).toBeTruthy();
      });
    });
  });
});
