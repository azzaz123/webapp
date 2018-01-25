/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAvatarComponent } from './item-avatar.component';
import { SanitizedBackgroundDirective } from 'shield';
import { MatIconModule } from '@angular/material';
import {
  MOCK_ITEM, ITEM_MAIN_IMAGE, USER_ID,
  FAKE_ITEM_IMAGE_SMALL_BASE_PATH,  Item,
  FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH
} from 'shield';

describe('ItemAvatarComponent', () => {
  let component: ItemAvatarComponent;
  let fixture: ComponentFixture<ItemAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule
      ],
      declarations: [
        ItemAvatarComponent,
        SanitizedBackgroundDirective
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ItemAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set the avatar and the fallback', () => {
    component.item = MOCK_ITEM;
    component.ngOnChanges();
    expect(component.avatar).toBe('https://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002514&pictureSize=W320');
    expect(component.fallback).toBe(FAKE_ITEM_IMAGE_SMALL_BASE_PATH);
  });

  it('should set the light fallback', () => {
    component.item = MOCK_ITEM;
    component.fallbackLight = true;
    component.ngOnChanges();
    expect(component.fallback).toBe(FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH);
  });

  it('should set the avatar with empty string', () => {
    component.item = new Item('1', 1, USER_ID);
    component.ngOnChanges();
    expect(component.avatar).toBe('');
  });
});
