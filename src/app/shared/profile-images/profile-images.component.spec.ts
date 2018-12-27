/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileImagesComponent } from './profile-images.component';
import { MatIconModule } from '@angular/material';
import { SanitizedBackgroundDirective } from '../sanitized-background/sanitized-background.directive';
import { PROFILE_IMAGE } from '../../../tests/profile.fixtures.spec';
import { FAKE_ITEM_IMAGE_SMALL_BASE_PATH, FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH } from '../../core/item/item';

describe('ItemAvatarComponent', () => {
  let component: ProfileImagesComponent;
  let fixture: ComponentFixture<ProfileImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule
      ],
      declarations: [
        ProfileImagesComponent,
        SanitizedBackgroundDirective
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should set the avatar and the fallback', () => {
    component.profileImage = PROFILE_IMAGE;
    component.ngOnChanges();

    expect(component.avatar).toBe('https://dock9.wallapop.com:8080/shnm-portlet/images?pictureId=500002512&pictureSize=W320');
    expect(component.fallback).toBe(FAKE_ITEM_IMAGE_SMALL_BASE_PATH);
  });

  it('should set the light fallback', () => {
    component.profileImage = PROFILE_IMAGE;
    component.fallbackLight = true;
    component.ngOnChanges();

    expect(component.fallback).toBe(FAKE_ITEM_IMAGE_SMALL_LIGHT_BASE_PATH);
  });
});
