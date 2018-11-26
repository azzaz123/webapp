/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileAvatarComponent } from './profile-avatar.component.ts';
import { MatIconModule } from '@angular/material';
import { SanitizedBackgroundDirective } from '../sanitized-background/sanitized-background.directive';

describe('ItemAvatarComponent', () => {
  let component: ProfileAvatarComponent;
  let fixture: ComponentFixture<ProfileAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        MatIconModule
      ],
      declarations: [
        ProfileAvatarComponent,
        SanitizedBackgroundDirective
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
