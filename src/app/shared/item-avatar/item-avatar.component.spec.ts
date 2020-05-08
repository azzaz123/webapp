/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ItemAvatarComponent } from './item-avatar.component';
import { MatIconModule } from '@angular/material';
import { SanitizedBackgroundDirective } from '../sanitized-background/sanitized-background.directive';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '../../core/item/item';
import { CREATE_MOCK_INBOX_CONVERSATION } from '../../../tests/inbox.fixtures.spec';

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
    component.item = CREATE_MOCK_INBOX_CONVERSATION();
    component.ngOnChanges();
    expect(component.fallback).toBe(FAKE_ITEM_IMAGE_SMALL_BASE_PATH);
  });

  it('should set the light fallback', () => {
    component.item = CREATE_MOCK_INBOX_CONVERSATION();
    component.fallbackLight = true;
    component.ngOnChanges();
    expect(component.fallback).toBe(FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH);
  });

  it('should set the avatar with empty string', () => {
    component.item = CREATE_MOCK_INBOX_CONVERSATION();
    component.ngOnChanges();
    expect(component.avatar).toBe('');
  });
});
