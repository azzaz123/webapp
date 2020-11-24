/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { ItemSoldComponent } from './item-sold.component';

describe('ItemSoldComponent', () => {
  let component: ItemSoldComponent;
  let fixture: ComponentFixture<ItemSoldComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemSoldComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemSoldComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
