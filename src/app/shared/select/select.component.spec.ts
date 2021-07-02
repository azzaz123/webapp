/* eslint-disable no-unused-vars, @typescript-eslint/no-unused-vars */
import { ComponentFixture, TestBed, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { SelectComponent } from './select.component';
import { SelectOption } from './select.interface';

describe('SelectComponent', () => {
  let component: SelectComponent;
  let fixture: ComponentFixture<SelectComponent>;

  beforeEach(
    waitForAsync(() => {
      TestBed.configureTestingModule({
        declarations: [SelectComponent],
        schemas: [CUSTOM_ELEMENTS_SCHEMA],
      }).compileComponents();
    })
  );

  const VALUE: string = 'value';
  const ITEM: SelectOption = {
    label: 'Label',
    value: VALUE,
  };
  const ITEM2: SelectOption = {
    label: 'Label',
    value: 'value2',
  };

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectComponent);
    component = fixture.componentInstance;
    component.items = [ITEM, ITEM2];
    fixture.detectChanges();
  });

  it('should set the default selected', () => {
    component.ngOnChanges();

    expect(component.selected).toBe(ITEM);
  });

  it('should set the selected value', () => {
    component.value = VALUE;

    component.ngOnChanges();

    expect(component.selected).toBe(ITEM);
  });

  it('should emit the value', fakeAsync(() => {
    let value: string;
    component.value$.subscribe((v: string) => {
      value = v;
    });

    component.selectItem(ITEM);
    tick();

    expect(value).toBe(ITEM.value);
    expect(component.selected).toBe(ITEM);
  }));
});
