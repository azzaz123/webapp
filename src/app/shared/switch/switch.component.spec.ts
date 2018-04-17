import { async, fakeAsync, tick, ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { SwitchComponent } from './switch.component';

fdescribe('SwitchComponent', () => {
  let component: SwitchComponent;
  let fixture: ComponentFixture<SwitchComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ FormsModule ],
      declarations: [ SwitchComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SwitchComponent);
    component = fixture.componentInstance;
    de            = fixture.debugElement;
    el            = de.nativeElement;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when checked value is', () => {
    it('false, input element should not be checked', fakeAsync(() => {
      component.checked = false;

      fixture.detectChanges();
      tick();

      const element = el.querySelector('input[type=checkbox]') as any;
      expect(element.checked).toBeFalsy();
    }));

    it('true, input element should be checked', fakeAsync(() => {
      component.checked = true;

      fixture.detectChanges();
      tick();

      const element = el.querySelector('input[type=checkbox]') as any;
      expect(element.checked).toBeTruthy();
    }));
  });

  describe('when disabled value is', () => {
    it('false, input element should be enable', fakeAsync(() => {
      component.disabled = false;

      fixture.detectChanges();
      tick();

      const element = el.querySelector('input[type=checkbox]') as any;
      expect(element.disabled).toBeFalsy();
    }));

    it('true, input element should be disable', fakeAsync(() => {
      component.disabled = true;

      fixture.detectChanges();
      tick();

      const element = el.querySelector('input[type=checkbox]') as any;
      expect(element.disabled).toBeTruthy();
    }));
  });

  it('false, input element should be enable', fakeAsync(() => {
    spyOn(component.change, 'emit');

    const element = el.querySelector('input[type=checkbox]') as any;
    element.click();
    fixture.detectChanges();

    expect(component.change.emit).toHaveBeenCalled();
  }));
});
