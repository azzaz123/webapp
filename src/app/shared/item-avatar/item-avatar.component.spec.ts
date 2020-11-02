/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAvatarComponent } from './item-avatar.component';
import { SanitizedBackgroundDirective } from '../sanitized-background/sanitized-background.directive';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH, Item } from '../../core/item/item';
import { MOCK_ITEM } from '../../../tests/item.fixtures.spec';
import { USER_ID } from '../../../tests/user.fixtures.spec';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../tests/inbox.fixtures.spec';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('ItemAvatarComponent', () => {
  let component: ItemAvatarComponent;
  let fixture: ComponentFixture<ItemAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      declarations: [
        ItemAvatarComponent,
        SanitizedBackgroundDirective
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
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
    expect(component.fallback).toBe(FAKE_ITEM_IMAGE_SMALL_BASE_PATH);
  });

  it('should set the light fallback', () => {
    component.item = MOCK_ITEM;
    component.inboxItem = CREATE_MOCK_INBOX_CONVERSATION();
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
