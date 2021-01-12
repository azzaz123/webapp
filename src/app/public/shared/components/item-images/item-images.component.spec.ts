import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemImagesComponent } from './item-images.component';

describe('ItemImagesComponent', () => {
  let component: ItemImagesComponent;
  let fixture: ComponentFixture<ItemImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ItemImagesComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
