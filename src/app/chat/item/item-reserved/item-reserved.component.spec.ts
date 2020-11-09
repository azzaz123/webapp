import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemReservedComponent } from './item-reserved.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ItemReservedComponent', () => {
  let component: ItemReservedComponent;
  let fixture: ComponentFixture<ItemReservedComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ItemReservedComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemReservedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
