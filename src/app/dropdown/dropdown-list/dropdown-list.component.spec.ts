import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CAR_BRANDS } from '../../../tests/car.fixtures.spec';
import { OptionList } from '../utils/option-list';

import { DropdownListComponent } from './dropdown-list.component';

describe('SelectDropdownComponent', () => {
  let component: DropdownListComponent;
  let fixture: ComponentFixture<DropdownListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownListComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DropdownListComponent);
    component = fixture.componentInstance;
  });

  describe('Spinner', () => {
    it('should show only spinner when is loading', () => {
      component.isLoading = true;

      fixture.detectChanges();
      const spinner = fixture.debugElement.query(By.css('.loading'));

      expect(spinner).toBeTruthy();
      expect(component.filterInput).toBeFalsy();
      expect(component.optionsList).toBeFalsy();
    });

    it('should not show spinner when is not loading', () => {
      component.isLoading = false;
      component.optionList = new OptionList([]);

      fixture.detectChanges();
      const spinner = fixture.debugElement.query(By.css('.loading'));

      expect(spinner).toBeFalsy();
    });
  });

  describe('Filter', () => {
    it('should show if it is enabled and not multiple options', () => {
      component.filterEnabled = true;
      component.multiple = false;
      component.optionList = new OptionList([]);

      fixture.detectChanges();

      expect(component.filterInput).toBeTruthy();
    });
  });

  describe('List', () => {
    it('should show not found default messagge', () => {
      component.optionList = new OptionList([]);

      fixture.detectChanges();

      expect(component.optionsList).toBeTruthy();
      expect(component.optionsList.nativeElement.textContent).toEqual('')
    });
    it('should show not found custom not found messagge', () => {
      const expectedMsg = "testMsg"
      component.optionList = new OptionList([]);
      component.notFoundMsg = expectedMsg;

      fixture.detectChanges();

      expect(component.optionsList).toBeTruthy();
      expect(component.optionsList.nativeElement.textContent).toEqual(expectedMsg)
    });

    it('should show all options', () => {
      component.optionList = new OptionList(CAR_BRANDS);

      fixture.detectChanges();

      CAR_BRANDS.forEach(
        (car) => {
          expect(component.optionsList.nativeElement.textContent).toContain(car.label)
        }
      )
    });
  });
});
