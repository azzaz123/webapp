import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';

import { CheckboxComponent } from './checkbox.component';
import { MatIconModule } from '@angular/material';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ MatIconModule ],
      declarations: [ CheckboxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    de            = fixture.debugElement;
    el            = de.nativeElement;
    fixture.detectChanges();
  });

  afterEach(() => {
    fixture.destroy();
  });

  describe('checkbox', () => {
    it('should not be checked when component checked property is false', fakeAsync(() => {
      component.checked = false;

      fixture.detectChanges();
      tick();

      const element = el.querySelector('button') as HTMLInputElement;
      expect(element.className).not.toContain('selected');
    }));

    it('should be checked when component checked property is true', fakeAsync(() => {
      component.checked = true;

      fixture.detectChanges();
      tick();

      const element = el.querySelector('button') as HTMLInputElement;
      expect(element.className).toContain('selected');
    }));
  });

  it('should emit checkedChange action, when checkbox is changed', () => {
    let inputValue: boolean;
    component.checkedChange.subscribe( value => inputValue = value);

    const element = el.querySelector('button') as HTMLInputElement;
    element.click();

    expect(inputValue).toBeTruthy();
  });

  it('should emit onChange action, when checkbox is changed', () => {
    let inputValue: boolean;
    component.onChange.subscribe( value => inputValue = value);

    const element = el.querySelector('button') as HTMLInputElement;
    element.click();

    expect(inputValue).toBeTruthy();
  });
});
