import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { SliderFormModule } from '@shared/form/components/slider/slider-form.module';
import { RangeFilterComponent } from './range-filter.component';

describe('RangeFilterComponent', () => {
  let component: RangeFilterComponent;
  let fixture: ComponentFixture<RangeFilterComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RangeFilterComponent],
      imports: [CommonModule, SliderFormModule, ReactiveFormsModule],
    })
      .overrideComponent(RangeFilterComponent, {
        set: { changeDetection: ChangeDetectionStrategy.Default },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RangeFilterComponent);
    component = fixture.componentInstance;
    de = fixture.debugElement;
    el = de.nativeElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
