import { SimpleChange } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CATEGORIES_OPTIONS_CONSUMER_GOODS } from '../../tests/category.fixtures.spec';

import { DropdownComponent } from './dropdown.component';

describe('DropdownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
  });

  describe('Placeholder', () => {
    it('should show default value', () => {
      component.value = null;
      fixture.detectChanges();

      const placeholder = fixture.debugElement.query(By.css('.placeholder'));
      const p: HTMLElement = placeholder.nativeElement;

      expect(p.textContent).toEqual('');
    });

    it('should show custom value', () => {
      const expected = "custom";
      component.value = null;
      component.placeholder = expected;
      fixture.detectChanges();

      const placeholder = fixture.debugElement.query(By.css('.placeholder'));
      const p: HTMLElement = placeholder.nativeElement;

      expect(p.textContent).toEqual(expected);
    });
  })

  describe('Show value', () => {
    it('should show label if options was loaded', () => {
      component.value = CATEGORIES_OPTIONS_CONSUMER_GOODS[0].value;
      component.ngOnChanges({
        options: new SimpleChange(null, CATEGORIES_OPTIONS_CONSUMER_GOODS, false)
      });
      fixture.detectChanges();

      const value = fixture.debugElement.query(By.css('.value'));
      const v: HTMLElement = value.nativeElement;

      expect(v.textContent).toEqual(CATEGORIES_OPTIONS_CONSUMER_GOODS[0].label);
    });

    it('should show value if options was not loaded', () => {
      component.value = CATEGORIES_OPTIONS_CONSUMER_GOODS[0].value;
      component.options = [];

      fixture.detectChanges();
      const value = fixture.debugElement.query(By.css('.value'));
      const v: HTMLElement = value.nativeElement;

      expect(v.textContent).toEqual(CATEGORIES_OPTIONS_CONSUMER_GOODS[0].value);
    });
  })

  describe('Show options', () => {
    it('should open options with click', () => {
      component.selectionSpan.nativeElement.click();
      fixture.detectChanges();

      expect(component.dropdown).toBeTruthy();
    });

    it('should close options with click', () => {
      component.isOpen = true;

      component.selectionSpan.nativeElement.click();
      fixture.detectChanges();

      expect(component.dropdown).toBeFalsy();
    });
  })
});
