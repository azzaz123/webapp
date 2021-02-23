import { CommonModule } from '@angular/common';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToggleFormComponent } from './toggle-form.component';

describe('ToggleFormComponent', () => {
  let component: ToggleFormComponent;
  let fixture: ComponentFixture<ToggleFormComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommonModule],
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
});
