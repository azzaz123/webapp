/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAvatarComponent } from './item-avatar.component';
import { SanitizedBackgroundDirective } from '../../../shared/sanitized-background/sanitized-background.directive';
import { MdIconModule } from '@angular/material';
import { MOCK_ITEM, ITEM_MAIN_IMAGE } from '../../../../test/fixtures/item.fixtures';
import {
  FAKE_ITEM_IMAGE_SMALL_BASE_PATH,  Item,
  FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH
} from '../item';
import { USER_ID } from '../../../../test/fixtures/user.fixtures';

describe('ItemAvatarComponent', () => {
  let component: ItemAvatarComponent;
  let fixture: ComponentFixture<ItemAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MdIconModule
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
    expect(component.avatar).toBe(ITEM_MAIN_IMAGE.urls_by_size.small);
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
