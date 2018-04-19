import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileProInfoComponent } from './profile-pro-info.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MOCK_USER } from '../../../../tests/user.fixtures.spec';
import { Observable } from 'rxjs/Observable';
import { UserService } from '../../../core/user/user.service';
import { ReactiveFormsModule } from '@angular/forms';
import { ProfileFormComponent } from '../../profile-form/profile-form.component';

describe('ProfileProInfoComponent', () => {
  let component: ProfileProInfoComponent;
  let fixture: ComponentFixture<ProfileProInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [ ProfileProInfoComponent, ProfileFormComponent  ],
      providers: [
        {
          provide: UserService, useValue: {
          me() {
            return Observable.of(MOCK_USER);
          }
        }
        },
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileProInfoComponent);
    component = fixture.componentInstance;
    component.formComponent = TestBed.createComponent(ProfileFormComponent).componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
