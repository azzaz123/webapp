import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { GenericImageComponent } from './generic-image.component';
import { SanitizedBackgroundDirective } from '../sanitized-background/sanitized-background.directive';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH, Item } from '@core/item/item';
import { MOCK_ITEM, MOCK_ITEM_FEATURED } from '@fixtures/item.fixtures.spec';
import { USER_ID } from '@fixtures/user.fixtures.spec';
import { CREATE_MOCK_INBOX_CONVERSATION } from '@fixtures/chat';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { NgxPermissionsModule, NgxPermissionsService } from 'ngx-permissions';
import { PERMISSIONS } from '@core/user/user-constants';
import { By } from '@angular/platform-browser';

describe('GenericImageComponent', () => {
  let component: GenericImageComponent;
  let fixture: ComponentFixture<GenericImageComponent>;
  let element: HTMLElement;

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericImageComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });
});
